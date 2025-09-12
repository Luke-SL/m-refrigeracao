<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="mdi-whatsapp" color="green" />
      </q-page-sticky>
      <!--<q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>-->
      <!-- Toolbar mobile -->

      <q-toolbar class="items-center bg-blue-6 div-toolbar-mobile no-wrap">
        <div class="row items-center q-gutter-sm full-width justify-between">
          <!-- Ícone do menu à esquerda -->
          <div class="flex-shrink-0">
            <q-btn flat @click="leftDrawerOpen = !leftDrawerOpen" round dense icon="menu" />
          </div>

          <!-- Input no centro - ocupa o espaço disponível -->
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

          <!-- Ícones à direita -->
          <div class="flex-shrink-0 q-gutter-xs">
            <q-btn flat round dense icon="mdi-basket-outline" aria-label="Carrinho" />
          </div>
        </div>
      </q-toolbar>
      <!-- Toolbar desktop -->
      <q-toolbar class="items-center bg-blue-6 div-toolbar-desktop">
        <div class="row items-center q-gutter-sm full-width">
          <div class="row items-center col justify-start">
            <q-img
              src="logo/logo-128x128.png"
              alt="Logo"
              spinner-color="white"
              style="height: 75px; max-width: 75px"
            />
          </div>
          <!-- Container centralizado -->
          <div class="row items-center col justify-center">
            <q-input rounded outlined v-model="search_text" bg-color="blue-grey-1" class="col-12">
              <!-- largura controlada -->
              <template v-slot:append>
                <q-icon name="mdi-magnify" @click="search_text = ''" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-btn flat round dense icon="mdi-account-circle" />
          </div>
          <div class="">
            <p class="q-mt-md">Minha Conta</p>
          </div>

          <!-- Ícones alinhados à direita -->
          <div class="row items-center col q-mr-md justify-end">
            <q-btn flat round dense icon="mdi-heart-outline" aria-label="Conta" class="q-mr-sm" />
            <q-btn flat round dense icon="mdi-basket-outline" aria-label="Carrinho" />
          </div>
        </div>
      </q-toolbar>
      <q-toolbar class="nav-bar bg-green-5 text-white justify-center menu-desktop">
        <div class="row items-center content q-gutter-md">
          <div class="col">
            <div class="row items-center q-gutter-md">
              <q-btn flat label="Ofertas" />
              <q-btn flat label="Ar-Condicionado" />
              <q-btn flat label="Ventiladores" />
              <q-btn flat label="Peças" />
              <q-btn flat label="Acessórios" />
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- rodapé desktop -->
    <div class="bg-blue-6 div-footer-desktop">
      <div class="row q-pa-md">
        <!-- Logo -->
        <div class="col-2 q-my-xl q-mx-lg">
          <q-img class="footer-logo" src="/logo/logo-footer.png" />
        </div>

        <!-- Formas de pagamento -->
        <div class="col-2">
          <p class="text-white text-bold text-body1">
            <q-icon name="mdi-credit-card-outline" size="md" /> Formas de pagamento
          </p>
          <div>
            <img
              src="/utils/flags/pix-banco-central-brasil-seeklogo.svg"
              alt="Pix"
              style="height: 32px"
            />
          </div>

          <div class="row items-center q-gutter-x-sm no-wrap">
            <img
              src="/utils/flags/visa-svgrepo-com.svg"
              alt="Visa"
              class="q-icon"
              style="width: 32px; height: 32px"
            />
            <img
              src="/utils/flags/hipercard-3-svgrepo-com.svg"
              alt="Hipercard"
              class="q-icon"
              style="width: 32px; height: 32px"
            />
            <img
              src="/utils/flags/amex-svgrepo-com.svg"
              alt="American Express"
              class="q-icon"
              style="width: 32px; height: 32px"
            />
          </div>
          <div class="row items-center q-gutter-x-sm no-wrap">
            <img
              src="/utils/flags/hiper-svgrepo-com.svg"
              alt="Hiper"
              class="q-icon"
              style="width: 32px; height: 32px"
            />
            <img
              src="/utils/flags/mastercard-full-svgrepo-com.svg"
              alt="MasterCard"
              class="q-icon"
              style="width: 32px; height: 32px"
            />
            <img
              src="/utils/flags/elo-3-svgrepo-com.svg"
              alt="Elo"
              class="q-icon"
              style="width: 32px; height: 32px"
            />
          </div>
          <div>
            <img
              src="/utils/flags/infinitepay-seeklogo.svg"
              alt="InfinitePay"
              class="q-icon"
              style="height: 64px; width: 128px"
            />
          </div>
        </div>
        <!-- Lojas físicas -->
        <div class="col-4">
          <p class="text-white text-bold text-body1">
            <q-icon name="mdi-store" size="md" /> Lojas físicas
          </p>
          <ul>
            <li><p class="text-white text-body1">Rua José Roque 44, Parelhas-RN 59360-000</p></li>
            <li>
              <p class="text-white text-body1">Rua Dr. Medeiros, Jardim do Sérido-RN 59343-000</p>
            </li>
            <li>
              <p class="text-white text-body1">
                Rua Tonheca Dantas, Carnaúba dos Dantas-RN 59374-000
              </p>
            </li>
          </ul>
        </div>

        <!-- Redes sociais -->
        <div class="col-3">
          <p class="text-white text-bold text-body1">
            <q-icon name="mdi-share-variant-outline" size="md" /> Redes sociais
          </p>
          <p class="text-white text-body2">
            <a
              target="_blank"
              class="links"
              href="https://www.instagram.com/m_refrigeracaoparelhas"
            >
              <q-icon name="mdi-instagram" size="md" color="white" />
              <span class="q-ml-sm">@m_refrigeracaoparelhas</span>
            </a>
          </p>
        </div>
      </div>
      <q-separator inset />
      <div class="flex flex-center q-pa-md text-white">
        © 2025 M Refrigeração – CNPJ 20.528.877/0001-67 | Comércio de refrigeração com qualidade e
        confiança.
      </div>
    </div>
    <!-- rodapé mobile -->

    <div class="bg-blue-6 div-footer-mobile text-white">
      <div class="" style="max-width: 85%; margin: auto">
        <q-list>
          <q-expansion-item
            expand-icon-toggle
            expand-separator
            icon="mdi-credit-card-outline"
            label="Formas de pagamento"
            default-opened
          >
            <q-card>
              <q-card-section class="bg-blue-6">
                <div>
                  <img
                    src="/utils/flags/pix-banco-central-brasil-seeklogo.svg"
                    alt="Pix"
                    style="height: 32px"
                  />
                  <img
                    class="q-pl-sm"
                    src="/utils/flags/infinitepay-seeklogo.svg"
                    alt="InfinitePay"
                    style="height: 32px; width: 64px"
                  />
                </div>

                <div class="row items-center q-gutter-x-sm no-wrap">
                  <img
                    src="/utils/flags/visa-svgrepo-com.svg"
                    alt="Visa"
                    class="q-icon"
                    style="width: 32px; height: 32px"
                  />
                  <img
                    src="/utils/flags/hipercard-3-svgrepo-com.svg"
                    alt="Hipercard"
                    class="q-icon"
                    style="width: 32px; height: 32px"
                  />
                  <img
                    src="/utils/flags/amex-svgrepo-com.svg"
                    alt="American Express"
                    class="q-icon"
                    style="width: 32px; height: 32px"
                  />
                  <img
                    src="/utils/flags/hiper-svgrepo-com.svg"
                    alt="Hiper"
                    class="q-icon"
                    style="width: 32px; height: 32px"
                  />
                  <img
                    src="/utils/flags/mastercard-full-svgrepo-com.svg"
                    alt="MasterCard"
                    class="q-icon"
                    style="width: 32px; height: 32px"
                  />
                  <img
                    src="/utils/flags/elo-3-svgrepo-com.svg"
                    alt="Elo"
                    class="q-icon"
                    style="width: 32px; height: 32px"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            expand-icon-toggle
            expand-separator
            icon="mdi-store"
            label="Lojas físicas"
          >
            <q-card>
              <q-card-section class="bg-blue-6">
                <ul>
                  <li>
                    <p class="text-white text-body2">Rua José Roque 44, Parelhas-RN 59360-000</p>
                  </li>
                  <li>
                    <p class="text-white text-body2">
                      Rua Dr. Medeiros, Jardim do Sérido-RN 59343-000
                    </p>
                  </li>
                  <li>
                    <p class="text-white text-body2">
                      Rua Tonheca Dantas, Carnaúba dos Dantas-RN 59374-000
                    </p>
                  </li>
                </ul>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item
            expand-icon-toggle
            expand-separator
            icon="mdi-share-variant-outline"
            label="Redes Sociais"
          >
            <q-card>
              <q-card-section class="bg-blue-6">
                <p class="text-white q-ml-xl text-body2">
                  <a
                    target="_blank"
                    class="links"
                    href="https://www.instagram.com/m_refrigeracaoparelhas"
                  >
                    <q-icon name="mdi-instagram" size="sm" color="white" />
                    <span class="q-ml-sm">@m_refrigeracaoparelhas</span>
                  </a>
                </p>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
      <q-separator inset />

      <div class="flex flex-center q-pa-sm text-white">
        <p class="justify-center">
          © 2025 M Refrigeração – CNPJ 20.528.877/0001-67 | Comércio de refrigeração com qualidade
          e confiança.
        </p>
      </div>
    </div>
  </q-layout>
</template>
<style lang="sass" scoped>
// Estilos gerais
.footer-logo
  max-width: 450px


.links
  text-decoration: none


ul
  list-style-type: none


@media (min-width: 1024px)
  .div-footer-desktop
    display: block;


  .div-footer-mobile
    display: none;




@media (max-width: $breakpoint-sm-max)
  .div-footer-desktop
    display: none


  .div-footer-mobile
    display: block

@media (min-width: $breakpoint-md-min)
  .div-toolbar-mobile
    display: none



@media (max-width: $breakpoint-sm-max)
  .menu-desktop
    display: none


  .div-toolbar-desktop
    display: none
</style>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Login',
    caption: '',
    icon: 'mdi-account',
    link: 'https://quasar.dev',
  },
  {
    title: 'Ofertas',
    caption: '',
    icon: 'mdi-offer',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Condicionadores de ar',
    caption: '',
    icon: 'mdi-snowflake',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Ventiladores',
    caption: '',
    icon: 'mdi-fan',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Peças',
    caption: '',
    icon: 'mdi-cog',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Acessórios',
    caption: '',
    icon: 'mdi-toolbox',
    link: 'https://facebook.quasar.dev',
  },
]

const search_text = ref('')

const leftDrawerOpen = ref(false)

/*function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}*/
</script>
