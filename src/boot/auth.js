// src/boot/auth.js
import useAuthUser from 'src/composables/UseAuthUser'

export default ({ app, router }) => {
  const auth = useAuthUser()

  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
    const requiredRoles = to.meta.roles // Array de roles permitidas

    // Aguarda o loading terminar
    while (auth.loading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    // Verifica se precisa estar logado
    if (requiresAuth && !auth.isLoggedIn.value) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    // Verifica se precisa estar deslogado
    if (requiresGuest && auth.isLoggedIn.value) {
      next('/')
      return
    }

    // Verifica roles se especificadas
    if (requiresAuth && requiredRoles && requiredRoles.length > 0) {
      const userRole = auth.user.value?.user_metadata?.role

      if (!userRole || !requiredRoles.includes(userRole)) {
        next('/acesso-negado')
        return
      }
    }

    next()
  })

  app.config.globalProperties.$auth = auth
}
