// src/router/index.js
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import useAuthUser from 'src/composables/UseAuthUser'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to) => {
    const { isLoggedIn } = useAuthUser()

    // Handle password recovery
    if (to.hash.includes('type=recovery') && to.name !== 'reset-password') {
      const access_token = to.hash.split('&')[0]
      const token = access_token.replace('#access_token=', '')
      return { name: 'reset-password', query: { token } }
    }

    // Check authentication for protected routes
    // ✅ Correção: usar .value ao invés de () para acessar o computed
    if (!isLoggedIn.value && to.meta.requiresAuth && !Object.keys(to.query).includes('fromEmail')) {
      return { name: 'loginDefault' }
    }
  })

  return Router
})
