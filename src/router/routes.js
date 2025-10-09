// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Rotas públicas
      {
        path: '',
        name: 'indexDefault',
        component: () => import('pages/IndexPage.vue'),
      },

      {
        path: 'email-confirmation',
        name: 'email-confirmation',
        component: () => import('pages/EmailConfirmation.vue'),
      },
      {
        path: 'product/:id',
        name: 'productDetail',
        component: () => import('pages/ProductPage.vue'),
      },

      // Rotas protegidas (requer autenticação)
      {
        path: 'auth/minha-pagina',
        name: 'minha-pagina',
        component: () => import('pages/auth/MePage.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: 'auth/meus-dados',
        name: 'meus-dados',
        component: () => import('pages/auth/MeDataPage.vue'),
        meta: { requiresAuth: true },
      },

      // ⬅️ ATUALIZADO: Usar requiresCargos
      {
        path: 'admin/cadastrar-produto',
        name: 'cadastrar-produto',
        component: () => import('pages/admin/NewProductPage.vue'),
        meta: {
          requiresAuth: true,
          requiresCargos: ['ceo', 'gerente'], // ⬅️ MUDANÇA
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'loginDefault',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('pages/ForgotPassword.vue'),
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('pages/ResetPassword.vue'),
      },
    ],
    meta: {
      requiresGuest: true,
    },
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
