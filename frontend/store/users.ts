import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  password: string
  cpf: string
  birthDate: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

interface NewUser {
  email: string
  createdAt?: string
}

interface NewUsersResponse {
  novos_users: NewUser[]
  total: number
}

interface AverageAgeResponse {
  media_idade: number
}

interface UserPayload {
  name: string
  email: string
  password: string
  cpf: string
  birthDate: string
  avatar?: string
}

interface StoreState {
  list: User[]
  current: User | null
  newUsers: string[]
  total: number
  averageAge: number
  loading: boolean
  error: string | null
  lastFetch: number | null
  cacheDuration: number
}

export const useUserStore = defineStore('users', {
  state: (): StoreState => ({
    list: [],
    current: null,
    newUsers: [],
    total: 0,
    averageAge: 0,
    loading: false,
    error: null,
    lastFetch: null,
    cacheDuration: 5 * 60 * 1000
  }),

  getters: {
    // Usuários ordenados por nome
    usersSortedByName: (state): User[] => {
      return [...state.list].sort((a, b) => a.name.localeCompare(b.name))
    },

    // Total de usuários
    totalUsers: (state): number => {
      return state.list.length
    },

    // Busca usuário por ID
    getUserById: (state) => {
      return (id: string): User | undefined => {
        return state.list.find(user => user.id === id)
      }
    },

    // Busca usuário por email
    getUserByEmail: (state) => {
      return (email: string): User | undefined => {
        return state.list.find(user => user.email === email)
      }
    },

    // Verifica se o cache está válido
    isCacheValid: (state): boolean => {
      if (!state.lastFetch) return false
      return Date.now() - state.lastFetch < state.cacheDuration
    },

    // Verifica se tem dados
    hasData: (state): boolean => {
      return state.list.length > 0
    }
  },

  actions: {
    setLoading(value: boolean) {
      this.loading = value
    },

    setError(message: string | null) {
      this.error = message
      if (message) {
        // Auto-limpa erro após 5 segundos
        setTimeout(() => {
          if (this.error === message) {
            this.error = null
          }
        }, 5000)
      }
    },

    clearError() {
      this.error = null
    },

    invalidateCache() {
      this.lastFetch = null
    },

    async fetch(force = false) {
      if (!force && this.isCacheValid && this.hasData) {
        return
      }

      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      
      try {
        const data = await $fetch<User[]>(`${apiURL}/users`)
        
        // Garante que sempre seja um array
        this.list = Array.isArray(data) ? data : []
        this.lastFetch = Date.now()
      } catch (err: any) {
        // Em caso de erro, mantém array vazio
        this.list = []
        
        const message = err?.data?.message || err?.message || 'Erro ao buscar usuários'
        this.setError(message)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async getOne(id: string) {
      // Tenta buscar do cache primeiro
      const cachedUser = this.getUserById(id)
      if (cachedUser && this.isCacheValid) {
        this.current = cachedUser
        return cachedUser
      }

      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      
      try {
        const user = await $fetch<User>(`${apiURL}/users/${id}`)
        this.current = user
        
        // Atualiza na lista se já existir
        const index = this.list.findIndex(u => u.id === id)
        if (index !== -1) {
          this.list[index] = user
        }
        
        return user
      } catch (err: any) {
        const message = err?.data?.message || err?.message || 'Erro ao carregar usuário'
        this.setError(message)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async create(payload: UserPayload) {
      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      
      try {
        const newUser = await $fetch<User>(`${apiURL}/users`, { 
          method: 'POST', 
          body: payload 
        })
        
        // Garante que list seja array antes de usar unshift
        if (!Array.isArray(this.list)) {
          this.list = []
        }
        
        this.list.unshift(newUser)
        this.invalidateCache()
        
        return newUser
      } catch (err: any) {
        const message = err?.data?.message || err?.message || 'Erro ao criar usuário'
        this.setError(message)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async update(id: string, payload: Partial<UserPayload>) {
      const { public: { apiURL } } = useRuntimeConfig()
      
      // Garante que list seja array
      if (!Array.isArray(this.list)) {
        this.list = []
      }
      
      const index = this.list.findIndex(u => u.id === id)
      const previousUser = index !== -1 ? { ...this.list[index] } : null
      
      this.setLoading(true)
      this.setError(null)
      
      try {
        if (index !== -1) {
          this.list[index] = { ...this.list[index], ...payload }
        }
        
        const updatedUser = await $fetch<User>(`${apiURL}/users/${id}`, { 
          method: 'PUT', 
          body: payload 
        })
        
        if (index !== -1) {
          this.list[index] = updatedUser
        }
        
        this.invalidateCache()
        return updatedUser
      } catch (err: any) {
        if (previousUser && index !== -1) {
          this.list[index] = previousUser
        }
        
        const message = err?.data?.message || err?.message || 'Erro ao atualizar usuário'
        this.setError(message)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async remove(id: string) {
      const { public: { apiURL } } = useRuntimeConfig()
      
      // Garante que list seja array
      if (!Array.isArray(this.list)) {
        this.list = []
      }
      
      const index = this.list.findIndex(u => u.id === id)
      const removedUser = index !== -1 ? this.list[index] : null
      
      this.setLoading(true)
      this.setError(null)
      
      try {
        if (index !== -1) {
          this.list.splice(index, 1)
        }
        
        await $fetch(`${apiURL}/users/${id}`, { method: 'DELETE' })
        this.invalidateCache()
      } catch (err: any) {
        if (removedUser && index !== -1) {
          this.list.splice(index, 0, removedUser)
        }
        
        const message = err?.data?.message || err?.message || 'Erro ao excluir usuário'
        this.setError(message)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async fetchNewUsers(force = false) {
      if (!force && this.newUsers.length > 0 && this.total > 0) {
        return
      }

      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      
      try {
        const response = await $fetch<NewUsersResponse>(`${apiURL}/users/new`)
        this.newUsers = response.novos_users.map(u => u.email)
        this.total = response.total
      } catch (err: any) {
        const message = err?.data?.message || 'Erro ao buscar novos usuários'
        this.setError(message)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async fetchAverageAge(force = false) {
      if (!force && this.averageAge > 0) {
        return
      }

      const { public: { apiURL } } = useRuntimeConfig()
      this.setLoading(true)
      this.setError(null)
      
      try {
        const response = await $fetch<AverageAgeResponse>(`${apiURL}/users/age`)
        this.averageAge = response.media_idade
      } catch (err: any) {
        const message = err?.data?.message || 'Erro ao buscar média de idade'
        this.setError(message)
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    // Método para recarregar todos os dados
    async refreshAll() {
      this.invalidateCache()
      await Promise.allSettled([
        this.fetch(true),
        this.fetchNewUsers(true),
        this.fetchAverageAge(true)
      ])
    }
  }
})
