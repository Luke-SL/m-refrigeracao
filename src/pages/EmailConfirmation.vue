<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md">
    <q-card class="q-pa-lg shadow-2 rounded-borders card-email-confirmation">
      <q-card-section class="text-center">
        <!-- Estado: Processando confirmação -->
        <q-spinner-hourglass v-if="isConfirming" size="64px" color="primary" />

        <!-- Estado: Confirmado com sucesso -->
        <q-icon v-else-if="isConfirmed" name="check_circle" size="64px" color="positive" />

        <!-- Estado: Aguardando confirmação -->
        <q-icon v-else name="email" size="64px" color="primary" />

        <div v-if="isConfirming" class="text-h6 q-mt-md">Confirmando seu e-mail...</div>
        <div v-else-if="isConfirmed" class="text-h6 q-mt-md">E-mail confirmado com sucesso!</div>
        <div v-else class="text-h6 q-mt-md">Confirme seu e-mail</div>

        <div v-if="!isConfirming && !isConfirmed" class="text-body2 text-grey-8 q-mt-sm">
          Enviamos um link de confirmação para:
        </div>
        <div v-if="!isConfirming && !isConfirmed" class="text-subtitle1 text-bold q-mt-sm">
          {{ email }}
        </div>

        <div v-if="isConfirmed" class="text-body2 text-grey-8 q-mt-sm">
          Redirecionando para o app...
        </div>

        <div v-if="errorMessage" class="text-body2 text-negative q-mt-sm">
          {{ errorMessage }}
        </div>
      </q-card-section>

      <q-card-actions v-if="!isConfirming" align="center" class="q-mt-lg">
        <q-btn
          v-if="isConfirmed"
          color="primary"
          label="Ir para o App"
          :to="{ name: 'minha-pagina' }"
          class="full-width"
          unelevated
        />
        <q-btn
          v-else
          color="primary"
          label="Ir para Login"
          :to="{ name: 'loginDefault' }"
          class="full-width"
          unelevated
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useAuthUser from 'src/composables/UseAuthUser'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'

const route = useRoute()
const router = useRouter()
const { refreshUser } = useAuthUser()

const email = ref(route.query.email || 'seu email')
const isConfirming = ref(false)
const isConfirmed = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  // Verificar se há hash na URL (token de confirmação)
  const hash = window.location.hash

  // Se há hash, significa que o usuário clicou no link do email
  if (hash && (hash.includes('access_token') || hash.includes('type=signup'))) {
    console.log('🔍 Hash detectado, processando confirmação...', hash)
    isConfirming.value = true

    try {
      // Aguardar um pouco para o Supabase processar o token
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Verificar se o usuário está autenticado agora
      const user = await refreshUser()

      if (user && user.email_confirmed_at) {
        console.log('✅ Email confirmado com sucesso!')
        isConfirmed.value = true
        positiveNotify('E-mail confirmado com sucesso!')

        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push({ name: 'minha-pagina' })
        }, 2000)
      } else if (user && !user.email_confirmed_at) {
        throw new Error('E-mail ainda não foi confirmado')
      } else {
        throw new Error('Não foi possível confirmar o e-mail')
      }
    } catch (error) {
      console.error('❌ Erro ao processar confirmação:', error)
      isConfirmed.value = false
      errorMessage.value = 'Link inválido ou expirado. Tente fazer login novamente.'
      negativeNotify('Erro ao confirmar e-mail')
    } finally {
      isConfirming.value = false
    }
  } else if (hash && hash.includes('error')) {
    // Se há erro na URL (token expirado, etc)
    console.error('❌ Erro na URL:', hash)

    if (hash.includes('otp_expired')) {
      errorMessage.value = 'O link de confirmação expirou. Por favor, solicite um novo link.'
    } else if (hash.includes('access_denied')) {
      errorMessage.value = 'Acesso negado. Por favor, tente novamente.'
    } else {
      errorMessage.value = 'Ocorreu um erro na confirmação. Tente fazer login.'
    }

    negativeNotify(errorMessage.value)
  }
})
</script>

<style lang="sass" scoped>
.card-email-confirmation
  width: 500px
  max-width: 95vw
</style>
