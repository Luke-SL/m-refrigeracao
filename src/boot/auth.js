// src/boot/auth.js
import useAuthUser from 'src/composables/UseAuthUser'

export default ({ app, router }) => {
  // Pega a referência do composable
  const auth = useAuthUser()

  // Guard global de rotas
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

    // Sempre use .value para refs
    // console.log(!auth.isLoggedIn.value)
    if (requiresAuth && !auth.isLoggedIn.value) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else if (requiresGuest && auth.isLoggedIn.value) {
      next('/')
    } else {
      next()
    }
  })

  // Disponibiliza globalmente
  app.config.globalProperties.$auth = auth
}
