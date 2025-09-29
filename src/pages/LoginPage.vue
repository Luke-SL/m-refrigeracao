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
          <q-input outlined v-model="email" label="E-mail" type="email" dense required />
          <q-input outlined v-model="password" label="Senha" type="password" dense required />

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

const email = ref('')
const password = ref('')
const loading = ref(false)
const { login, loginWithSocialProvider } = useAuthUser()
const router = useRouter()

const onSubmit = async () => {
  loading.value = true
  try {
    // console.log("e-mail: ", email.value);
    // console.log("password: ", password.value);
    await login(email.value, password.value)
    positiveNotify('Login realizado com sucesso!')
    loading.value = false
    router.push({ name: 'indexDefault', query: { t: Date.now() } })
  } catch (error) {
    negativeNotify(error.message)
  }
  loading.value = false
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
