<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <!-- Toolbar mobile -->
      <q-toolbar class="items-center bg-blue-6 div-toolbar-mobile no-wrap">
        <div class="row items-center q-gutter-sm full-width justify-between">
          <!-- Ícone menu -->
          <div class="flex-shrink-0">
            <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
          </div>

          <!-- Input central -->
          <div class="col q-px-sm">
            <q-input
              rounded
              outlined
              v-model="search_text"
              bg-color="blue-grey-1"
              dense
              class="full-width"
            >
              <template v-slot:append>
                <q-icon name="mdi-magnify" @click="search_text = ''" class="cursor-pointer" />
              </template>
            </q-input>
          </div>

          <!-- Ícones direita -->
          <div class="flex-shrink-0 q-gutter-xs">
            <q-btn flat round dense icon="mdi-basket-outline" aria-label="Carrinho" />
          </div>
        </div>
      </q-toolbar>

      <!-- Toolbar Desktop -->
      <q-toolbar class="items-center bg-blue-6 div-toolbar-desktop">
        <div class="row items-center full-width q-gutter-sm justify-between">
          <!-- Logo -->
          <div class="col-auto row items-center justify-start">
            <router-link :to="{ name: 'indexDefault' }" class="logo-link">
              <q-img
                class="q-mb-md"
                src="logo/logo-estendido-plus.png"
                fit="contain"
                alt="Logo"
                spinner-color="white"
              />
            </router-link>
          </div>

          <!-- Input central -->
          <div class="col row items-center justify-center no-wrap">
            <q-input
              rounded
              outlined
              v-model="search_text"
              bg-color="blue-grey-1"
              dense
              class="central-input"
            >
              <template v-slot:append>
                <q-icon name="mdi-magnify" @click="search_text = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <div class="q-ml-sm">
              <div v-if="loading == true"><q-spinner /> LOADING...</div>

              <div v-else-if="loading == false && !!user == true">
                <div class>
                  <q-btn-dropdown
                    flat
                    dense
                    icon="mdi-account"
                    :label="'Olá, ' + $auth.user.value.user_metadata.primeiro_nome"
                  >
                    <q-list>
                      <q-item clickable v-close-popup @click="$router.push('/auth/minha-pagina')">
                        <q-item-section avatar>
                          <q-avatar
                            icon="mdi-account-arrow-left-outline"
                            color="primary"
                            text-color="white"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Minha Conta</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup @click="handleLogout">
                        <q-item-section avatar>
                          <q-avatar icon="mdi-logout" color="red" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Sair</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </div>

              <div v-else>
                <q-btn flat to="/login" color="white">Entrar</q-btn>
              </div>
            </div>

            <!-- Loading state -->
            <div v-if="loading.value" class="row items-center q-gutter-sm">
              <q-spinner size="24px" color="white" />
              <span class="text-white">Carregando...</span>
            </div>
          </div>

          <!-- Usuário + Ícones -->
          <div class="col-auto row items-center q-gutter-sm justify-end">
            <!-- Loading -->
            <!-- Exibe enquanto carrega -->

            <!-- Ícones finais -->
            <q-btn
              flat
              round
              dense
              icon="mdi-heart-outline"
              aria-label="Favoritos"
              class="q-ml-sm"
            />
            <q-btn flat round dense icon="mdi-basket-outline" aria-label="Carrinho" />
          </div>
        </div>
      </q-toolbar>

      <!-- Navbar desktop -->
      <q-toolbar class="nav-bar bg-green-5 text-white justify-center menu-desktop">
        <div class="row items-center content q-gutter-md">
          <div class="col">
            <div class="row items-center q-gutter-md">
              <q-btn flat label="Ofertas" to="/ofertas" />
              <q-btn flat label="Ar-Condicionado" to="/condicionadores" />
              <q-btn flat label="Ventiladores" to="/ventiladores" />
              <q-btn flat label="Peças" to="/pecas" />
              <q-btn flat label="Acessórios" to="/acessorios" />
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer lateral -->
    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <EssentialLink />
      </q-list>
    </q-drawer>

    <!-- WhatsApp flutuante -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="whatsapp-sticky">
      <q-btn
        fab
        icon="mdi-whatsapp"
        color="green"
        type="a"
        href="https://wa.me/5584999894891?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20representante"
        target="_blank"
      />
    </q-page-sticky>

    <!-- Conteúdo principal -->
    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>

    <!-- Rodapé -->
    <FooterComponent />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'src/components/layout/EssentialLink.vue'
import useAuthUser from 'src/composables/UseAuthUser'
import FooterComponent from 'src/components/layout/FooterComponent.vue'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'

const { user, loading, logout } = useAuthUser()
const router = useRouter()

const handleLogout = async () => {
  try {
    await logout()
    positiveNotify('Sessão encerrada com sucesso!')
    router.go(0)
  } catch (error) {
    negativeNotify(error.message)
  }
}

const search_text = ref('')
const leftDrawerOpen = ref(false)
</script>

<style lang="sass" scoped>
.whatsapp-sticky
  z-index: 1 !important;

.logo-link
  height: 96px
  width: 256px
  text-decoration: none;
  display: inline-block;

.central-input
  max-width: 450px
  width: 100%

@media (max-width: $breakpoint-sm-max)
  .div-toolbar-desktop
    display: none
  .menu-desktop
    display: none

@media (min-width: $breakpoint-md-min)
  .div-toolbar-mobile
    display: none
</style>
