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
        path: 'minha-pagina',
        name: 'minha-pagina',
        component: () => import('pages/auth/MePage.vue'),
        meta: { requiresAuth: true },
      },
      // Adicione outras rotas protegidas aqui
      {
        path: 'minha-conta',
        name: 'minha-conta',
        component: () => import('pages/auth/MePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'meus-dados',
        name: 'meus-dados',
        component: () => import('pages/auth/MeDataPage.vue'),
        meta: { requiresAuth: true },
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
      requiresGuest: true, // Exige que não esteja logado
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
