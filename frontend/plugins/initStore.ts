import { useUserStore } from '~/store/users'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Só executa no cliente (browser), não no servidor durante build
  if (process.server) return

  const store = useUserStore()
  
  if (!store.list.length && !store.loading) {
    store.loading = true
    try {
      await Promise.allSettled([
        store.fetch(),
        store.fetchNewUsers(),
        store.fetchAverageAge()
      ])
    } catch (err) {
      console.error('Erro ao inicializar store:', err)
      store.error = 'Não foi possível conectar ao servidor'
    } finally {
      store.loading = false
    }
  }
})
