<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-2 rounded-borders login-card">
      <!-- Ícone de cadeado no topo -->
      <q-card-section class="text-center">
        <q-avatar size="64px" color="primary" text-color="white">
          <q-icon name="mdi-account" size="32px" />
        </q-avatar>
        <div class="text-h6 text-primary q-mt-sm">Já tem uma conta?</div>
      </q-card-section>

      <q-card-section>
        <!-- Formulário de login -->
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            outlined
            v-model="email"
            label="E-mail"
            type="email"
            dense
            required
            :rules="loginEmailRules"
          />
          <q-input
            outlined
            v-model="password"
            label="Senha"
            type="password"
            dense
            required
            :rules="loginSenhaRules"
          />

          <div class="row q-gutter-sm">
            <q-btn
              type="submit"
              label="Entrar"
              color="primary"
              class="col full-width q-mt-md"
              :loading="loading"
            />
          </div>
        </q-form>

        <!-- Link para criar conta -->
        <div class="text-center q-mt-md">
          <q-btn flat dense no-caps color="primary" to="/register" label="Criar conta" /><br />
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            :to="{ name: 'forgot-password' }"
            label="Esqueceu a senha?"
            class="q-mt-sm"
          />
        </div>

        <!-- Divider -->
        <div class="row items-center q-my-md">
          <div class="col"><q-separator /></div>
          <div class="col-auto text-grey">ou</div>
          <div class="col"><q-separator /></div>
        </div>

        <!-- Login com Google e Apple (somente ícones redondos lado a lado) -->
        <div class="row justify-center q-gutter-md">
          <q-btn
            round
            size="lg"
            color="red"
            text-color="white"
            icon="mdi-google"
            @click="loginWithGoogle"
          />
          <q-btn
            round
            size="lg"
            color="black"
            text-color="white"
            icon="mdi-apple"
            @click="loginWithApple"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import useAuthUser from 'src/composables/UseAuthUser'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'
import { validarLogin } from 'src/utils/validations/validarLogin'

const email = ref('')
const password = ref('')
const loading = ref(false)
const { login, loginWithSocialProvider } = useAuthUser()
const router = useRouter()

const loginEmailRules = [
  (val) => !!val || 'E-mail é obrigatório',
  (val) => val?.trim() === val || 'E-mail não pode ter espaços no início ou fim',
  (val) => /.+@.+\..+/.test(val) || 'E-mail inválido',
]

const loginSenhaRules = [
  (val) => !!val || 'Senha é obrigatória',
  (val) => val.length >= 8 || 'Senha deve ter pelo menos 8 caracteres',
  (val) => val === val.trim() || 'Senha não pode ter espaços no início ou fim',
]

const onSubmit = async () => {
  const {
    isValid,
    message,
    email: emailValidado,
    password: passwordValidado,
  } = await validarLogin(email.value, password.value)
  if (!isValid) return negativeNotify(message)

  loading.value = true
  try {
    await login(emailValidado, passwordValidado)
    positiveNotify('Login realizado com sucesso!')
    router.push({ name: 'indexDefault', query: { t: Date.now() } })
  } catch (error) {
    negativeNotify(error.message || 'Erro ao realizar login.')
  } finally {
    loading.value = false
  }
}

const loginWithGoogle = async () => {
  try {
    await loginWithSocialProvider('google')
    positiveNotify()
    router.push({ name: 'me' })
  } catch (error) {
    negativeNotify(error.message)
  }
}

const loginWithApple = async () => {
  try {
    await loginWithSocialProvider('apple')
    positiveNotify()
    router.push({ name: 'me' })
  } catch (error) {
    negativeNotify(error.message)
  }
}
</script>

<style lang="sass" scoped>
.rounded-borders
  border-radius: 16px

.login-card
  width: 400px
  max-width: 90vw
</style>
