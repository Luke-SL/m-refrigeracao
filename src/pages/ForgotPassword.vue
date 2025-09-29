<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2 rounded-borders login-card">
      <!-- Ícone de cadeado no topo -->
      <q-card-section class="text-center">
        <q-avatar size="64px" color="primary" text-color="white">
          <q-icon name="mdi-lock-reset" size="32px" />
        </q-avatar>
        <div class="text-h6 text-primary q-mt-sm">Esqueceu a senha?</div>
      </q-card-section>

      <q-card-section>
        <!-- Formulário de login -->
        <q-form @submit.prevent="onSubmit" class="q-gutter-md" ref="formRef">
          <q-input
            outlined
            v-model="email"
            label="E-mail cadastrado"
            type="email"
            dense
            required
            :rules="emailRules"
            lazy-rules
            error-message="Por favor, insira um e-mail válido"
          />

          <div class="row q-gutter-sm">
            <q-btn
              type="submit"
              label="Enviar e-mail"
              color="primary"
              class="col full-width q-mt-md"
              :loading="loading"
              :disable="!isValidEmail"
            />
          </div>
        </q-form>

        <!-- Link para criar conta -->
        <div class="text-center q-mt-md">
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            :to="{ name: 'loginDefault' }"
            label="Voltar para o Login"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
//import { useRouter } from 'vue-router'

import useAuthUser from 'src/composables/UseAuthUser'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'

const email = ref('')
const loading = ref(false)
const formRef = ref(null)
const { sendPasswordResetEmail } = useAuthUser()
//const router = useRouter()

// Regras de validação de e-mail
const emailRules = [
  (val) => (val && val.length > 0) || 'E-mail é obrigatório',
  (val) => isValidEmailFormat(val) || 'Formato de e-mail inválido',
  (val) => val.length <= 254 || 'E-mail muito longo',
]

// Função para validar formato do e-mail
const isValidEmailFormat = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

// Computed para verificar se o e-mail é válido
const isValidEmail = computed(() => {
  return (
    email.value &&
    email.value.length > 0 &&
    isValidEmailFormat(email.value) &&
    email.value.length <= 254
  )
})

const onSubmit = async () => {
  // Valida o formulário antes de enviar
  const isValid = await formRef.value.validate()

  if (!isValid) {
    negativeNotify('Por favor, corrija os erros no formulário')
    return
  }

  loading.value = true
  try {
    await sendPasswordResetEmail(email.value)
    positiveNotify(`Um email foi enviado para ${email.value}`)
    // Limpar o campo após envio bem-sucedido
    email.value = ''
  } catch (error) {
    negativeNotify(error.message)
  }

  loading.value = false
}
</script>

<style lang="sass" scoped>
.rounded-borders
  border-radius: 16px

.login-card
  max-width: 600px
  /*max-height: 400px*/
  /*height: 100%*/
  width: 100%
  /*max-width: 90vw*/
</style>
