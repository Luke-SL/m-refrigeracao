<template>
  <q-item clickable class="text-primary" v-if="loading == true">
    <q-item-section avatar>
      <q-spinner size="2em" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Carregando</q-item-label>
    </q-item-section>
  </q-item>
  <q-item
    clickable
    class="text-primary"
    v-else-if="loading == false && !!user == true"
    @click="handleRedirect('/minha-pagina')"
  >
    <q-item-section avatar>
      <q-icon name="mdi-account" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ $auth.user.value.user_metadata.primeiro_nome }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-item clickable v-else @click="handleRedirect('/login')">
    <q-item-section avatar>
      <q-icon name="mdi-login" />
    </q-item-section>

    <q-item-section>
      <q-item-label>Login</q-item-label>
    </q-item-section>
  </q-item>

  <q-item clickable v-for="link in linksList" :key="link.title" @click="handleRedirect(link.link)">
    <q-item-section avatar>
      <q-icon :name="link.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ link.title }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-item v-if="!!user == true" clickable @click="handleLogout" class="text-red">
    <q-item-section avatar>
      <q-icon name="mdi-logout" />
    </q-item-section>
    <q-item-section>
      <q-item-label>Sair</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import useAuthUser from 'src/composables/UseAuthUser'
import { useRouter } from 'vue-router'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'

const handleRedirect = async (page) => {
  router.push(page)
}

const handleLogout = async () => {
  try {
    await logout()
    positiveNotify('Sessão encerrada com sucesso!')
    router.push({ name: 'indexDefault' })
  } catch (error) {
    negativeNotify(error.message)
  }
}

const { user, loading, logout } = useAuthUser()
const router = useRouter()

const linksList = [
  { title: 'Ofertas', icon: 'mdi-offer', link: '/ofertas' },
  { title: 'Condicionadores de ar', icon: 'mdi-snowflake', link: '/condicionadores' },
  { title: 'Ventiladores', icon: 'mdi-fan', link: '/ventiladores' },
  { title: 'Peças', icon: 'mdi-cog', link: '/pecas' },
  { title: 'Acessórios', icon: 'mdi-toolbox', link: '/acessorios' },
]
</script>
