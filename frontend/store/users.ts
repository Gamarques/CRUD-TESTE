import { defineStore } from 'pinia'

type User = {
  id: string
  name: string
  email: string
  password: string
  cpf: string
  birthDate: string
  avatar: string
  createdAt?: string
  updatedAt?: string
}

type NewUsersResponse = {
  novos_users: Array<{ email: string }>
  total: number
}

type AverageAgeResponse = {
  media_idade: number
}

export const useUserStore = defineStore('users', {
  state: () => ({
    list: [] as User[],
    current: null as User | null,
    newUsers: [] as string[],
    total: 0,
    averageAge: 0,
    loading: false,
    error: null as string | null
  }),

  actions: {
    setLoading(value: boolean) {
      this.loading = value
    },

    setError(message: string | null) {
      this.error = message
    },

    async fetch(force = false) {
      if (this.list.length > 0 && !force) return // evita refetch desnecessário
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      try {
        this.list = await $fetch(`${apiURL}/users`)
      } catch (err: any) {
        this.setError(err?.message || 'Erro ao buscar usuários')
      } finally {
        this.setLoading(false)
      }
    },

    async getOne(id: string) {
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      try {
        this.current = await $fetch(`${apiURL}/users/${id}`)
      } catch (err: any) {
        this.setError(err?.message || 'Erro ao carregar usuário')
      } finally {
        this.setLoading(false)
      }
    },

    async create(payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      try {
        await $fetch(`${apiURL}/users`, { method: 'POST', body: payload })
        await this.fetch(true) // força refetch após criar
      } catch (err: any) {
        this.setError(err?.message || 'Erro ao criar usuário')
      } finally {
        this.setLoading(false)
      }
    },

    async update(id: string, payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      try {
        await $fetch(`${apiURL}/users/${id}`, { method: 'PUT', body: payload })
        await this.fetch(true)
      } catch (err: any) {
        this.setError(err?.message || 'Erro ao atualizar usuário')
      } finally {
        this.setLoading(false)
      }
    },

    async remove(id: string) {
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      try {
        await $fetch(`${apiURL}/users/${id}`, { method: 'DELETE' })
        this.list = this.list.filter(user => user.id !== id)
      } catch (err: any) {
        this.setError(err?.message || 'Erro ao excluir usuário')
      } finally {
        this.setLoading(false)
      }
    },

    async fetchNewUsers(force = false) {
      if (this.newUsers.length > 0 && this.total > 0 && !force) return
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      try {
        const response = await $fetch<NewUsersResponse>(`${apiURL}/users/new`)
        this.newUsers = response.novos_users.map(u => u.email)
        this.total = response.total
      } catch (err: any) {
        this.setError('Erro ao buscar novos usuários')
      } finally {
        this.setLoading(false)
      }
    },

    async fetchAverageAge(force = false) {
      if (this.averageAge > 0 && !force) return
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      try {
        const response = await $fetch<AverageAgeResponse>(`${apiURL}/users/age`)
        this.averageAge = response.media_idade
      } catch (err: any) {
        this.setError('Erro ao buscar média de idade')
      } finally {
        this.setLoading(false)
      }
    }
  }
})
