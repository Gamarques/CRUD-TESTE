import { useUserStore } from '~/store/users'

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useUserStore()
  if (!store.list.length && !store.loading) {
    store.loading = true
    try {
      await Promise.all([
        store.fetch(),
        store.fetchNewUsers(),
        store.fetchAverageAge()
      ])
    } catch (err) {
      console.error('Erro ao inicializar store:', err)
    } finally {
      store.loading = false
    }
  }
})
