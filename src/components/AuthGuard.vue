<!-- src/components/AuthGuard.vue -->
<template>
  <!-- Componente invisível que monitora erros de auth -->
  <div v-if="false"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import useAuthUser from 'src/composables/UseAuthUser'

const router = useRouter()
const { user } = useAuthUser()

// Função para limpar sessões inválidas
const clearInvalidSession = () => {
  console.log('🧹 Limpando sessão inválida...')

  // Limpar todos os tokens do Supabase
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('sb-')) {
      localStorage.removeItem(key)
    }
  })

  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('sb-')) {
      sessionStorage.removeItem(key)
    }
  })

  console.log('✅ Sessão limpa')
}

// Interceptar erros do fetch global
const setupErrorInterceptor = () => {
  const originalFetch = window.fetch

  window.fetch = async (...args) => {
    const response = await originalFetch(...args)

    // Detectar erros de auth em requests do Supabase
    if (args[0]?.toString().includes('supabase.co')) {
      // Erro 403 = Token inválido
      if (response.status === 403) {
        console.warn('⚠️ Erro 403 detectado - Token inválido')
        clearInvalidSession()

        setTimeout(() => {
          router.push('/login')
        }, 1000)
      }

      // Erro 406 = Token corrompido ou headers incorretos
      if (response.status === 406) {
        console.warn('⚠️ Erro 406 detectado - Token possivelmente corrompido')
        clearInvalidSession()

        setTimeout(() => {
          router.push('/login')
        }, 1000)
      }
    }

    return response
  }
}

onMounted(() => {
  // Configurar interceptor de erros
  setupErrorInterceptor()

  console.log('✅ AuthGuard ativo - Monitorando sessões inválidas')
})

// Também monitorar mudanças no user
watch(user, (newUser, oldUser) => {
  // Se tinha user e agora não tem mais (foi limpo)
  if (oldUser && !newUser) {
    console.log('👤 Usuário removido - Verificando rota...')

    // Se não está em página pública, redirecionar
    const publicRoutes = ['/login', '/register', '/reset-password']
    const currentRoute = router.currentRoute.value.path

    if (!publicRoutes.includes(currentRoute)) {
      console.log('🔄 Redirecionando para login...')
      router.push('/login')
    }
  }
})
</script>

<style scoped>
/* Componente invisível */
</style>
