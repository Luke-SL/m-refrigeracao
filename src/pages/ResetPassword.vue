<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2 rounded-borders login-card">
      <!-- Ícone de cadeado no topo -->
      <q-card-section class="text-center">
        <q-avatar size="64px" color="primary" text-color="white">
          <q-icon name="mdi-lock-check" size="32px" />
        </q-avatar>
        <div class="text-h6 text-primary q-mt-sm">Redefinir senha</div>
      </q-card-section>

      <q-card-section>
        <!-- Formulário de redefinição de senha -->
        <q-form @submit.prevent="onSubmit" class="q-gutter-md" ref="formRef">
          <q-input
            outlined
            v-model="password"
            label="Nova senha"
            :type="showPassword ? 'text' : 'password'"
            dense
            required
            :rules="passwordRules"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            outlined
            v-model="confirmPassword"
            label="Confirmar nova senha"
            :type="showConfirmPassword ? 'text' : 'password'"
            dense
            required
            :rules="confirmPasswordRules"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <div class="row q-gutter-sm">
            <q-btn
              type="submit"
              label="Alterar senha"
              color="primary"
              class="col full-width q-mt-md"
              :loading="loading"
              :disable="!isValidForm"
            />
          </div>
        </q-form>

        <!-- Link para voltar ao login -->
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
import { useRouter } from 'vue-router'

import useAuthUser from 'src/composables/UseAuthUser'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const formRef = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const { resetPassword, logout } = useAuthUser()
const router = useRouter()

// Regras de validação de senha
const passwordRules = [
  (val) => (val && val.length > 0) || 'Senha é obrigatória',
  (val) => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
  (val) => val.length <= 50 || 'Senha muito longa (máximo 50 caracteres)',
  (val) => /(?=.*[a-z])/.test(val) || 'Senha deve conter pelo menos uma letra minúscula',
  (val) => /(?=.*[A-Z])/.test(val) || 'Senha deve conter pelo menos uma letra maiúscula',
  (val) => /(?=.*\d)/.test(val) || 'Senha deve conter pelo menos um número',
]

// Regras de validação de confirmação de senha
const confirmPasswordRules = [
  (val) => (val && val.length > 0) || 'Confirmação de senha é obrigatória',
  (val) => val === password.value || 'Senhas não coincidem',
]

// Computed para verificar se o formulário é válido
const isValidForm = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value.length >= 6 &&
    password.value.length <= 50 &&
    /(?=.*[a-z])/.test(password.value) &&
    /(?=.*[A-Z])/.test(password.value) &&
    /(?=.*\d)/.test(password.value) &&
    password.value === confirmPassword.value
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
    await resetPassword(password.value)
    positiveNotify('Senha alterada com sucesso!')
    // Limpar os campos após sucesso
    password.value = ''
    confirmPassword.value = ''
    await logout()
    loading.value = false
    router.push('login')
    // Opcional: redirecionar para login após alguns segundos
    // setTimeout(() => router.push({ name: 'loginDefault' }), 2000)
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

.cursor-pointer
  cursor: pointer
</style>
