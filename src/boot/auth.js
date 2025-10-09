// src/boot/auth.js
import useAuthUser from 'src/composables/UseAuthUser'

export default ({ app, router }) => {
  const auth = useAuthUser()

  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)
    const requiresCargos = to.meta.requiresCargos // ⬅️ MUDANÇA: Array de cargos permitidos

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

    // ⬅️ ATUALIZADO: Verifica cargos da tabela time_comercio
    if (requiresAuth && requiresCargos && requiresCargos.length > 0) {
      // Se não tem cargo (não está na equipe), redireciona para home
      if (!auth.cargo.value) {
        next('/')
        return
      }

      // Verifica se o cargo do usuário está na lista permitida
      if (!requiresCargos.includes(auth.cargo.value)) {
        next('/')
        return
      }
    }

    next()
  })

  app.config.globalProperties.$auth = auth
}
