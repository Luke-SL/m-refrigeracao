<template>
  <q-page class="q-pa-lg bg-grey-2 flex flex-center">
    <!-- Estado de carregamento -->
    <div v-if="loading" class="full-width flex flex-center column">
      <q-spinner size="3em" color="primary" class="q-mb-md" />
      <q-skeleton width="80%" height="30px" type="rect" class="q-mb-md" />
      <q-skeleton width="90%" height="400px" type="rect" class="q-mb-md" />
      <q-skeleton width="70%" height="30px" type="rect" />
    </div>

    <!-- Conteúdo do produto -->
    <div v-else-if="product" class="full-width flex flex-center">
      <div class="column items-center full-width" style="max-width: 1200px">
        <!-- CARD PRINCIPAL -->
        <q-card class="q-pa-md row items-start q-col-gutter-lg no-shadow full-width">
          <!-- Miniaturas à esquerda -->
          <div class="col-auto desktop-only" style="max-width: 80px">
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

          <!-- Imagem principal no centro -->
          <div class="col-auto main-image-wrapper">
            <div
              ref="zoomContainer"
              class="zoom-container"
              @mouseenter="startZoom"
              @mousemove="handleZoom"
              @mouseleave="endZoom"
            >
              <q-img ref="zoomImage" :src="selectedImage" class="main-img" fit="contain" />
            </div>
            <div class="zoom-hint q-mt-sm text-center desktop-only">
              <q-chip color="primary" text-color="white" size="sm" icon="zoom_in">
                Passe o mouse para ampliar
              </q-chip>
            </div>

            <!-- Miniaturas abaixo (mobile) -->
            <div class="thumbnails-mobile q-mt-md">
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
          </div>

          <!-- Informações do produto à direita -->
          <div class="col text-left">
            <div class="q-mb-md">
              <h2 class="text-h5 q-mb-sm product-title">
                {{ product.productName }}
              </h2>
              <div class="q-my-sm">
                <q-rating
                  v-model="ratingModel"
                  size="1.5em"
                  color="green-5"
                  icon="star_border"
                  icon-selected="star"
                />
              </div>

              <!-- Preço com ou sem desconto -->
              <PriceDisplay
                :price="product.price"
                :discount="product.discount"
                :quota="product.quota"
                @show-payment="paymentDialog = true"
              />
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

            <!-- CALCULADORA DE FRETE -->
            <div class="q-mt-lg">
              <q-separator class="q-mb-md" />
              <FreteCalculator
                :produto="product"
                :valor-frete-gratis="500"
                @frete-selecionado="onFreteSelecionado"
              />
            </div>
          </div>
        </q-card>

        <!-- SOBRE O PRODUTO -->
        <q-card class="q-pa-md no-shadow q-mt-lg full-width">
          <q-card-section class="full-width-section">
            <div class="text-h6 text-primary">Descrição do Produto</div>
            <p class="text-body2 text-grey-8 q-mt-sm">
              {{ product.descricao || 'Descrição não disponível.' }}
            </p>
          </q-card-section>
        </q-card>

        <!-- FICHA TÉCNICA -->
        <q-card class="q-pa-md no-shadow q-mt-lg full-width">
          <q-card-section class="full-width-section">
            <div class="text-h6 text-primary">Informações</div>
            <div class="table-wrapper">
              <q-markup-table flat bordered class="q-mt-sm full-width-table">
                <tbody>
                  <tr v-for="(item, i) in productSpecs" :key="i">
                    <td class="text-weight-medium">{{ item.label }}</td>
                    <td>{{ item.value }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </q-card-section>
        </q-card>

        <!-- DIALOG DE FORMAS DE PAGAMENTO -->
        <q-dialog v-model="paymentDialog">
          <q-card class="dialog-payment q-pa-md">
            <q-card-section>
              <div class="text-h6 text-primary q-mb-md">Formas de Pagamento</div>
              <q-markup-table flat>
                <tbody>
                  <tr>
                    <td class="text-weight-medium">À vista no PIX</td>
                    <td class="text-green-8 text-bold">
                      {{ formatCurrency(precoFinal) }}
                      <span v-if="product.discount"> ({{ product.discount }}% OFF)</span>
                    </td>
                  </tr>

                  <tr v-for="i in product.quota" :key="i">
                    <td class="text-weight-medium">{{ i }}x sem juros</td>
                    <td>{{ formatCurrency(product.price / i) }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Fechar" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <!-- Produto não encontrado -->
    <div v-else class="text-center q-pa-xl">
      <q-icon name="mdi-alert-circle-outline" size="4rem" color="grey-5" />
      <p class="text-h6 text-grey-6 q-mt-md">Produto não encontrado</p>
      <q-btn color="primary" label="Voltar para a loja" to="/" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatCurrency } from 'src/utils/format'
import { positiveNotify } from 'src/composables/UseNotify'
import useApi from 'src/composables/useApi'
import FreteCalculator from 'src/components/FreteCalculator.vue'
import PriceDisplay from 'src/components/PriceDisplay.vue'

const { getVariacaoPorId } = useApi()
const route = useRoute()

const product = ref(null)
const selectedImage = ref('')
const ratingModel = ref(4)
const loading = ref(true)
const paymentDialog = ref(false)
const freteSelecionado = ref(null)

// Zoom
const zoomContainer = ref(null)
const zoomImage = ref(null)
const isZooming = ref(false)
const ZOOM_LEVEL = 2.5
const TRANSITION_SPEED = '0.1s'

// Preço final com desconto
const precoFinal = computed(() => {
  if (!product.value) return 0
  return product.value.discount
    ? product.value.price - (product.value.price * product.value.discount) / 100
    : product.value.price
})

// Ficha técnica dinâmica
const productSpecs = computed(() => {
  if (!product.value) return []
  return [
    { label: 'Marca', value: product.value.marca || '—' },
    { label: 'Categoria', value: product.value.categoria || '—' },
    { label: 'Voltagem', value: product.value.voltagem || '—' },
    { label: 'Tipo', value: product.value.tipo || '—' },
    { label: 'BTUs', value: product.value.btus || '—' },
    { label: 'Garantia', value: product.value.garantia || '—' },
    {
      label: 'Peso Líquido',
      value: product.value.peso_liquido ? product.value.peso_liquido + ' kg' : '—',
    },
    {
      label: 'Peso Bruto',
      value: product.value.peso_bruto ? product.value.peso_bruto + ' kg' : '—',
    },
    { label: 'Largura', value: product.value.largura ? product.value.largura + ' cm' : '—' },
    { label: 'Altura', value: product.value.altura ? product.value.altura + ' cm' : '—' },
    {
      label: 'Profundidade',
      value: product.value.profundidade ? product.value.profundidade + ' cm' : '—',
    },
  ]
})

const loadProduct = async () => {
  try {
    const id = route.params.id
    const data = await getVariacaoPorId(id)
    if (data) {
      product.value = data
      selectedImage.value = data.images?.[0] || data.imagePath
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const buyProduct = () => {
  let mensagem = 'Produto adicionado ao carrinho!'

  if (freteSelecionado.value) {
    mensagem += ` Frete: ${freteSelecionado.value.nome} - ${formatCurrency(freteSelecionado.value.valor)}`
  }

  positiveNotify(mensagem)
}

const onFreteSelecionado = (frete) => {
  freteSelecionado.value = frete
  console.log('Frete selecionado:', frete)
}

// Zoom handlers
const startZoom = () => {
  isZooming.value = true
  const img = zoomImage.value?.$el?.querySelector('img') || zoomImage.value?.$el
  if (img) {
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
  const img = zoomImage.value?.$el?.querySelector('img') || zoomImage.value?.$el
  if (img) {
    img.style.transition = 'transform 0.3s ease-out'
    img.style.transform = 'scale(1)'
    img.style.transformOrigin = 'center center'
    zoomContainer.value.style.cursor = 'default'
  }
}

onMounted(loadProduct)
</script>

<style lang="sass" scoped>
.dialog-payment
  max-width: 600px
  width: 90vw

.full-width
  width: 100%

.full-width-section
  width: 100% !important

.table-wrapper
  width: 100% !important
  overflow-x: auto

.q-markup-table
  width: 100% !important

.thumb-img
  width: 70px
  height: 70px
  border: 2px solid #ccc
  border-radius: 0 !important
  background: #fff

.selected-thumb
  border: 2px solid #6cd47a !important

// Zoom container
.zoom-container
  position: relative
  width: 480px
  height: 480px
  border-radius: 0 !important
  border: 1px solid #eee
  background: #fff
  overflow: hidden
  cursor: default
  flex-shrink: 0

.main-image-wrapper
  flex-shrink: 0

.main-img
  width: 100%
  height: 100%
  border-radius: 0 !important

.zoom-hint
  text-align: center

// Miniaturas mobile - escondidas por padrão
.thumbnails-mobile
  display: none
  gap: 12px
  justify-content: center
  flex-wrap: wrap

.thumb-img-mobile
  width: 60px
  height: 60px
  border: 2px solid #ccc
  border-radius: 0 !important
  background: #fff

.product-title
  word-wrap: break-word
  word-break: break-word
  white-space: normal

.text-strike
  text-decoration: line-through

// Animações do zoom
.zoom-container .main-img ::v-deep(img)
  transform-origin: center center
  will-change: transform
  transition: transform 0.1s ease-out

.zoom-container:hover
  border-color: #1976d2

// Força object-fit contain
.main-img ::v-deep(.q-img__image)
  object-fit: contain !important

// Responsividade - Tablet e Mobile
@media (max-width: 1023px)
  .desktop-only
    display: none !important

  .q-card
    display: flex !important
    flex-direction: column !important
    align-items: center !important

  .main-image-wrapper
    width: 100% !important
    max-width: 600px !important
    margin: 0 auto !important
    display: flex !important
    flex-direction: column !important
    align-items: center !important

  .zoom-container
    width: 100% !important
    max-width: 600px !important
    height: 450px

  .thumbnails-mobile
    display: flex !important
    width: 100% !important

  .col-auto
    width: 100% !important
    max-width: 100% !important

  .col
    width: 100% !important
    max-width: 100% !important

  // Garante mesma largura para todos os cards
  .product-card
    max-width: 100% !important
    width: 100% !important

  // Ajusta largura e padding da ficha técnica
  .q-markup-table
    width: 100% !important
    min-width: 100% !important

  .q-markup-table td
    padding: 12px 16px !important
    font-size: 0.9rem !important

  .q-markup-table td:first-child
    width: 45% !important

  .q-markup-table td:last-child
    width: 55% !important

@media (max-width: 599px)
  .zoom-container
    height: 350px !important

  .thumb-img-mobile
    width: 50px
    height: 50px

// Desktop grande
@media (min-width: 1400px)
  .zoom-container
    width: 550px
    height: 550px
</style>
