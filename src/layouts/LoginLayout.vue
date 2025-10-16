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
          <div class="col row items-center justify-center">
            <div class="q-ml-sm"></div>

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
import EssentialLink from 'src/components/layout/EssentialLink.vue'
import useAuthUser from 'src/composables/UseAuthUser'
import FooterComponent from 'src/components/layout/FooterComponent.vue'

const { loading } = useAuthUser()

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

@media (max-width: $breakpoint-sm-max)
  .div-toolbar-desktop
    display: none
  .menu-desktop
    display: none

@media (min-width: $breakpoint-md-min)
  .div-toolbar-mobile
    display: none
</style>
