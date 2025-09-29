<template>
  <q-page class="q-pa-lg bg-grey-2 flex flex-center">
    <div v-if="product" class="full-width flex flex-center">
      <div class="column items-center">
        <!-- CARD PRINCIPAL DE COMPRA -->
        <q-card class="q-pa-md no-shadow desktop-product-cards">
          <div class="row items-start q-col-gutter-lg">
            <!-- Miniaturas à esquerda -->
            <div class="desktop-layout">
              <div class="col-auto q-mr-sm">
                <div class="column q-gutter-md">
                  <q-img
                    v-for="(img, index) in product.images"
                    :key="index"
                    :src="img"
                    class="cursor-pointer thumb-img"
                    :class="{ 'selected-thumb': selectedImage === img }"
                    fit="contain"
                    @click="selectedImage = img"
                  />
                </div>
              </div>

              <!-- Imagem principal com zoom -->
              <div class="col-auto q-mr-md">
                <div
                  ref="zoomContainer"
                  class="zoom-container"
                  @mouseenter="startZoom"
                  @mousemove="handleZoom"
                  @mouseleave="endZoom"
                  @touchstart="handleTouchStart"
                  @touchmove="handleTouchMove"
                  @touchend="handleTouchEnd"
                >
                  <q-img
                    ref="zoomImage"
                    :src="selectedImage"
                    class="main-img zoom-image"
                    fit="contain"
                  />
                </div>
                <div class="zoom-hint q-mt-sm">
                  <q-chip color="primary" text-color="white" size="sm" icon="zoom_in">
                    Passe o mouse para ampliar
                  </q-chip>
                </div>
              </div>

              <!-- Informações do produto -->
              <div class="col text-left">
                <div class="q-mb-md">
                  <h2 class="text-h5 q-mb-sm product-title">{{ product.productName }}</h2>

                  <div class="q-my-sm">
                    <q-rating
                      v-model="ratingModel"
                      size="1em"
                      color="green-5"
                      icon="star_border"
                      icon-selected="star"
                    />
                  </div>

                  <div v-if="product.discount">
                    <div class="row">
                      <div class="text-body1 text-grey-6 q-mt-xs text-strike">
                        {{ formatCurrency(product.price) }}
                      </div>
                      <div class="bg-blue-2 q-pa-xs q-ml-sm rounded-borders">
                        {{ product.discount }}% OFF
                      </div>
                    </div>
                    <div class="text-h4 text-bold q-my-sm text-green-8">
                      {{ formatCurrency(product.price - product.price * (product.discount / 100)) }}
                    </div>
                    <div>
                      <p class="text-green-8">À vista no pix ou no cartão</p>
                      <p>
                        ou {{ product.quota }}x de
                        {{ formatCurrency(product.price / product.quota) }} sem juros
                      </p>
                      <p>
                        <a href="#" @click.prevent="alert = true" class="text-primary">
                          Ver formas de pagamento
                        </a>
                      </p>
                    </div>
                  </div>

                  <div v-else>
                    <div class="text-h4 text-bold q-my-sm text-green-8">
                      {{ formatCurrency(product.price) }}
                    </div>
                    <div>
                      <p class="text-green-8">À vista no pix ou no cartão</p>
                      <p>
                        ou {{ product.quota }}x de
                        {{ formatCurrency(product.price / product.quota) }} sem juros
                      </p>
                      <p>
                        <a href="#" @click.prevent="alert = true" class="text-primary">
                          Ver formas de pagamento
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <q-btn
                  icon="mdi-basket-plus"
                  color="primary"
                  unelevated
                  size="lg"
                  label="comprar"
                  class="full-width"
                  @click="buyProduct"
                />

                <div class="q-my-md q-pa-md bg-white rounded-borders">
                  <div class="row items-center q-gutter-sm">
                    <q-icon name="mdi-truck-outline" class="q-mb-md" size="sm" color="blue-9" />
                    <span class="text-weight-medium text-blue-9 q-mb-md q-mr-sm"
                      >Consulte seu frete</span
                    >

                    <q-input
                      outlined
                      dense
                      label="CEP"
                      rounded
                      bottom-slots
                      v-model="zip_code"
                      mask="##.###-###"
                      class=""
                    >
                      <template v-slot:append>
                        <q-icon name="mdi-magnify" @click="zip_code = ''" class="cursor-pointer" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>

            <!-- Layout Mobile (< 1024px) -->
            <div class="mobile-layout">
              <!-- Imagem principal no mobile com zoom -->
              <div class="text-center q-mb-md">
                <div
                  ref="zoomContainerMobile"
                  class="zoom-container-mobile"
                  @touchstart="handleTouchStart"
                  @touchmove="handleTouchMove"
                  @touchend="handleTouchEnd"
                >
                  <q-img
                    ref="zoomImageMobile"
                    :src="selectedImage"
                    class="main-img-mobile zoom-image-mobile"
                    fit="contain"
                  />
                </div>
                <div class="zoom-hint-mobile q-mt-sm">
                  <q-chip color="primary" text-color="white" size="sm" icon="touch_app">
                    Toque para ampliar
                  </q-chip>
                </div>
              </div>

              <!-- Miniaturas em linha no mobile -->
              <div class="row justify-center q-gutter-sm q-mb-lg">
                <q-img
                  v-for="(img, index) in product.images"
                  :key="index"
                  :src="img"
                  class="cursor-pointer thumb-img-mobile"
                  :class="{ 'selected-thumb': selectedImage === img }"
                  fit="contain"
                  @click="selectedImage = img"
                />
              </div>

              <!-- Informações do produto no mobile -->
              <div class="mobile-product-info">
                <div class="q-mb-md">
                  <h2 class="text-h5 q-mb-sm product-title">{{ product.productName }}</h2>

                  <div class="q-my-sm">
                    <q-rating
                      v-model="ratingModel"
                      size="1em"
                      color="green-5"
                      icon="star_border"
                      icon-selected="star"
                    />
                  </div>

                  <div v-if="product.discount">
                    <div class="row">
                      <div class="text-body1 text-grey-6 q-mt-xs text-strike">
                        {{ formatCurrency(product.price) }}
                      </div>
                      <div class="bg-blue-2 q-pa-xs q-ml-sm rounded-borders">
                        {{ product.discount }}% OFF
                      </div>
                    </div>
                    <div class="text-h4 text-bold q-my-sm text-green-8">
                      {{ formatCurrency(product.price - product.price * (product.discount / 100)) }}
                    </div>
                    <div>
                      <p class="text-green-8">À vista no pix ou no cartão</p>
                      <p>
                        ou {{ product.quota }}x de
                        {{ formatCurrency(product.price / product.quota) }} sem juros
                      </p>
                      <p>
                        <a href="#" @click.prevent="alert = true" class="text-primary">
                          Ver formas de pagamento
                        </a>
                      </p>
                    </div>
                  </div>
                  <div v-else>
                    <div class="text-h4 text-bold q-my-sm text-green-8">
                      {{ formatCurrency(product.price) }}
                    </div>
                    <div>
                      <p class="text-green-8">À vista no pix ou no cartão</p>
                      <p>
                        ou {{ product.quota }}x de
                        {{ formatCurrency(product.price / product.quota) }} sem juros
                      </p>
                      <p>
                        <a href="#" @click.prevent="alert = true" class="text-primary">
                          Ver formas de pagamento
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <q-btn
                  icon="mdi-basket-plus"
                  color="primary"
                  unelevated
                  size="lg"
                  label="comprar"
                  class="full-width q-mb-md"
                  @click="buyProduct"
                  dense
                />

                <div class="q-pa-smr bg-white rounded-borders">
                  <div class="bg-white rounded-borders mobile-shipping-card">
                    <div class="row items-center q-mb-sm">
                      <q-icon name="mdi-truck-outline" size="md" color="blue-9" />
                      <span class="text-weight-medium text-blue-9 q-ml-sm">Consulte seu frete</span>
                    </div>

                    <q-input
                      outlined
                      dense
                      label="CEP"
                      rounded
                      bottom-slots
                      v-model="zip_code"
                      mask="##.###-###"
                    >
                      <template v-slot:append>
                        <q-icon name="mdi-magnify" @click="zip_code = ''" class="cursor-pointer" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>

        <!-- CARD SOBRE O PRODUTO -->
        <q-card class="q-pa-md no-shadow q-mt-lg desktop-product-cards">
          <q-card-section>
            <div class="text-h6 text-primary">Sobre o Produto</div>
            <p class="text-body2 text-grey-8 q-mt-sm">
              {{ productDescription }}
            </p>
          </q-card-section>
        </q-card>

        <!-- CARD FICHA TÉCNICA -->
        <q-card class="q-pa-md no-shadow q-mt-lg desktop-product-cards">
          <q-card-section>
            <div class="text-h6 text-primary">Ficha Técnica</div>
            <q-markup-table flat bordered class="q-mt-sm">
              <tbody>
                <tr v-for="spec in productSpecs" :key="spec.label">
                  <td class="text-weight-medium">{{ spec.label }}</td>
                  <td>{{ spec.value }}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>

        <!-- DIALOG DE FORMAS DE PAGAMENTO -->
        <q-dialog v-model="alert">
          <q-card class="dialog-payment">
            <q-card-section>
              <div class="row justify-center">
                <div class="text-h6 row items-center">
                  <q-icon name="mdi-credit-card" class="q-mr-sm" size="md" color="blue-8" />
                  <p class="text-grey-8 text-weight-medium q-mb-none">Formas de pagamento</p>
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none" v-if="product.discount">
              <div class="row items-center">
                <q-img
                  fit="contain"
                  src="/utils/flags/pix-banco-central-brasil-seeklogo.svg"
                  alt="Pix"
                  class="q-mr-lg payment-image"
                />
                <div class="column">
                  <p class="q-mb-xs text-body1">Valor no PIX com desconto</p>
                  <p class="text-h6 text-bold text-green-8 q-mb-none">
                    {{ formatCurrency(product.price - product.price * (product.discount / 100)) }}
                    ({{ product.discount }}% OFF)
                  </p>
                </div>
              </div>
              <q-separator />
            </q-card-section>

            <q-card-section class="q-pt-none" v-else>
              <div class="row items-center">
                <q-img
                  fit="contain"
                  src="/utils/flags/pix-banco-central-brasil-seeklogo.svg"
                  alt="Pix"
                  class="q-mr-lg payment-image"
                />
                <div class="column">
                  <p class="q-mb-xs text-body1">Valor no PIX</p>
                  <p class="text-h6 text-bold text-green-8 q-mb-none">
                    {{ formatCurrency(product.price) }}
                  </p>
                </div>
              </div>
              <q-separator />
            </q-card-section>

            <q-card-section>
              <p class="text-subtitle1">Cartão de crédito</p>
              <q-markup-table flat bordered>
                <thead>
                  <tr>
                    <th class="text-left">Parcela</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in product.quota" :key="i" :class="i % 2 !== 0 ? 'bg-grey-2' : ''">
                    <td>
                      <span v-if="i === 1 && product.discount" class="text-green-8 text-bold">
                        {{ i }}x
                        {{
                          formatCurrency(product.price - product.price * (product.discount / 100))
                        }}
                      </span>
                      <span v-else-if="i === 1" class="text-green-8 text-bold">
                        {{ i }}x {{ formatCurrency(product.price) }}
                      </span>
                      <span v-else> {{ i }}x {{ formatCurrency(product.price / i) }} </span>
                    </td>
                    <td class="text-right">
                      <span v-if="i === 1 && product.discount" class="text-green-8 text-bold">
                        {{
                          formatCurrency(product.price - product.price * (product.discount / 100))
                        }}
                      </span>
                      <span v-else>
                        {{ formatCurrency(product.price) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>

              <div class="row items-center q-gutter-x-sm no-wrap q-mt-md">
                <q-img
                  class="payment-image"
                  fit="contain"
                  src="/utils/flags/visa-svgrepo-com.svg"
                  alt="Visa"
                />
                <q-img
                  class="payment-image"
                  fit="contain"
                  src="/utils/flags/hipercard-3-svgrepo-com.svg"
                  alt="Hipercard"
                />
                <q-img
                  class="payment-image"
                  fit="contain"
                  src="/utils/flags/amex-svgrepo-com.svg"
                  alt="American Express"
                />
                <q-img
                  class="payment-image"
                  fit="contain"
                  src="/utils/flags/hiper-svgrepo-com.svg"
                  alt="Hiper"
                />
                <q-img
                  class="payment-image"
                  fit="contain"
                  src="/utils/flags/mastercard-full-svgrepo-com.svg"
                  alt="MasterCard"
                />
                <q-img
                  class="payment-image"
                  fit="contain"
                  src="/utils/flags/elo-3-svgrepo-com.svg"
                  alt="Elo"
                />
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <!-- Loading state ou produto não encontrado -->
    <div v-else class="text-center q-pa-xl">
      <q-icon name="mdi-alert-circle-outline" size="4rem" color="grey-5" />
      <p class="text-h6 text-grey-6 q-mt-md">Produto não encontrado</p>
      <q-btn color="primary" label="Voltar para a loja" to="/" />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency } from 'src/utils/format'
import { positiveNotify } from 'src/composables/UseNotify'
import { getProductDescription, getProductSpecs } from './product-page'

export default {
  setup() {
    const router = useRouter()

    const product = ref(null)
    const selectedImage = ref('')
    const ratingModel = ref(4)
    const zip_code = ref('')
    const number = ref(1)
    const alert = ref(false)

    // Refs para zoom
    const zoomContainer = ref(null)
    const zoomImage = ref(null)
    const zoomContainerMobile = ref(null)
    const zoomImageMobile = ref(null)

    // Estados do zoom
    const isZooming = ref(false)
    const ZOOM_LEVEL = 2.5
    const TRANSITION_SPEED = '0.1s'

    // Computed properties para descrição e especificações
    const productDescription = computed(() => getProductDescription(product.value))
    const productSpecs = computed(() => getProductSpecs(product.value))

    const loadProduct = () => {
      // Tenta carregar o produto do localStorage primeiro
      const savedProduct = localStorage.getItem('selectedProduct')
      if (savedProduct) {
        product.value = JSON.parse(savedProduct)
        selectedImage.value = product.value.images?.[0] || product.value.imagePath
        return
      }

      // Se não houver produto salvo, redireciona para a home
      router.push('/')
    }

    const buyProduct = () => {
      positiveNotify('Produto adicionado ao carrinho!')
    }

    // Funções de zoom para desktop
    const startZoom = () => {
      isZooming.value = true
      if (zoomImage.value?.$el) {
        const img = zoomImage.value.$el.querySelector('img') || zoomImage.value.$el
        img.style.transition = `transform ${TRANSITION_SPEED} ease-out`
        zoomContainer.value.style.cursor = 'crosshair'
      }
    }

    const handleZoom = (event) => {
      if (!isZooming.value || !zoomContainer.value || !zoomImage.value?.$el) return

      const rect = zoomContainer.value.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const xPercent = (x / rect.width) * 100
      const yPercent = (y / rect.height) * 100

      const img = zoomImage.value.$el.querySelector('img') || zoomImage.value.$el
      img.style.transformOrigin = `${xPercent}% ${yPercent}%`
      img.style.transform = `scale(${ZOOM_LEVEL})`
    }

    const endZoom = () => {
      isZooming.value = false
      if (zoomImage.value?.$el) {
        const img = zoomImage.value.$el.querySelector('img') || zoomImage.value.$el
        img.style.transition = 'transform 0.3s ease-out'
        img.style.transform = 'scale(1)'
        img.style.transformOrigin = 'center center'
        zoomContainer.value.style.cursor = 'default'
      }
    }

    // Funções de touch para mobile
    const handleTouchStart = (event) => {
      event.preventDefault()
      isZooming.value = true

      const container = event.currentTarget
      const imageRef = container.classList.contains('zoom-container-mobile')
        ? zoomImageMobile
        : zoomImage

      if (imageRef.value?.$el) {
        const img = imageRef.value.$el.querySelector('img') || imageRef.value.$el
        img.style.transition = `transform ${TRANSITION_SPEED} ease-out`
      }
    }

    const handleTouchMove = (event) => {
      if (!isZooming.value) return
      event.preventDefault()

      const touch = event.touches[0]
      const container = event.currentTarget
      const rect = container.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100))
      const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100))

      const imageRef = container.classList.contains('zoom-container-mobile')
        ? zoomImageMobile
        : zoomImage

      if (imageRef.value?.$el) {
        const img = imageRef.value.$el.querySelector('img') || imageRef.value.$el
        img.style.transformOrigin = `${xPercent}% ${yPercent}%`
        img.style.transform = `scale(${ZOOM_LEVEL})`
      }
    }

    const handleTouchEnd = (event) => {
      isZooming.value = false
      const container = event.currentTarget
      const imageRef = container.classList.contains('zoom-container-mobile')
        ? zoomImageMobile
        : zoomImage

      if (imageRef.value?.$el) {
        const img = imageRef.value.$el.querySelector('img') || imageRef.value.$el
        img.style.transition = 'transform 0.3s ease-out'
        img.style.transform = 'scale(1)'
        img.style.transformOrigin = 'center center'
      }
    }

    onMounted(() => {
      loadProduct()
    })

    return {
      product,
      selectedImage,
      ratingModel,
      zip_code,
      number,
      alert,
      zoomContainer,
      zoomImage,
      zoomContainerMobile,
      zoomImageMobile,
      formatCurrency,
      buyProduct,
      productDescription,
      productSpecs,
      startZoom,
      handleZoom,
      endZoom,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    }
  },
}
</script>

<style lang="sass" scoped>
.payment-image
  width: 64px
  height: 96px

.dialog-payment
  max-width: 600px
  width: 90vw

.desktop-product-cards
  max-width: 1200px
  width: 100%

// Estilos gerais
.thumb-img
  width: 70px
  height: 70px
  border: 2px solid #ccc
  border-radius: 0 !important
  background: #fff

.selected-thumb
  border: 2px solid #6cd47a !important

.main-img
  max-width: 600px
  max-height: 500px
  border-radius: 0 !important
  border: 1px solid #eee
  background: #fff

// Container das informações do produto (lado direito)
.product-info-container
  max-width: 320px
  flex-shrink: 0

// Info do frete
.shipping-info
  width: 100%
  max-width: 320px
  margin-left: 0

// Estilos do zoom
.zoom-container
  position: relative
  width: 600px
  height: 500px
  border: 1px solid #eee
  border-radius: 0 !important
  overflow: hidden
  cursor: default
  background: #fff

.zoom-image
  width: 100%
  height: 100%
  transition: transform 0.1s ease-out

.zoom-container-mobile
  position: relative
  width: 100%
  max-width: 600px
  height: 400px
  border: 1px solid #eee
  border-radius: 0 !important
  overflow: hidden
  background: #fff
  margin: 0 auto
  display: flex
  align-items: center
  justify-content: center

.zoom-image-mobile
  width: 100%
  height: 100%
  transition: transform 0.1s ease-out
  object-fit: contain !important

.zoom-hint,
.zoom-hint-mobile
  text-align: center

.product-title
  word-wrap: break-word
  word-break: break-word
  white-space: normal

.text-strike
  text-decoration: line-through

// Estilos para desktop (>= 1024px)
.desktop-layout
  display: flex

.desktop-main-img
  width: 540px

.mobile-layout
  display: none

.btn-comprar
  display: block
  margin: auto

// Estilos para mobile (< 1024px)
@media (max-width: $breakpoint-sm-max)
  .mobile-shipping-card
    display: flex
    flex-direction: column
    align-items: flex-start
    width: 100% !important
    margin-left: 0 !important
    gap: 8px

  .desktop-layout
    display: none !important

  .mobile-layout
    display: block !important
    width: 100%

  // wrapper para centralizar a imagem principal
  .mobile-image-wrap
    display: flex
    justify-content: center
    align-items: center
    padding: 0 12px
    margin-bottom: 16px

  // imagem principal mobile
  .main-img-mobile
    display: block !important
    width: 100%
    border-radius: 0 !important
    border: 1px solid #eee
    background: #fff
    margin-left: auto
    margin-right: auto
    object-fit: contain !important

  .zoom-container-mobile
    max-width: 700px
    height: 600px

  .thumb-img-mobile
    width: 50px
    height: 50px

  .mobile-product-info .bg-white
    width: 100% !important
    margin-left: 0 !important



// Estilos para tablets e mobile pequeno
@media (max-width: $breakpoint-sm-min)
  .zoom-container-mobile
    max-width: 480px
    height: 300px

  .thumb-img-mobile
    width: 50px
    height: 50px

// Animações suaves para o zoom
.zoom-image img,
.zoom-image-mobile img
  transform-origin: center center
  will-change: transform

// Melhorias visuais
.zoom-container:hover
  border-color: #1976d2

.zoom-container-mobile:active
  border-color: #1976d2

// Força object-fit contain nas imagens do Quasar
.zoom-image ::v-deep(.q-img__image),
.zoom-image-mobile ::v-deep(.q-img__image)
  object-fit: contain !important

// Centraliza melhor as imagens
.zoom-container,
.zoom-container-mobile
  ::v-deep(.q-img__container)
    display: flex
    align-items: center
    justify-content: center

// Responsividade adicional para desktop
@media (min-width: $breakpoint-md-min)
  .product-info-container
    padding-left: 16px
</style>
