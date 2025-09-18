<template>
  <q-page class="q-pa-lg bg-grey-2 flex flex-center">
    <q-card
      class="q-pa-md row items-start q-col-gutter-lg no-shadow"
      style="max-width: 1200px; width: 100%"
    >
      <!-- Miniaturas à esquerda -->
      <div class="col-auto" style="max-width: 80px">
        <div class="column q-gutter-md">
          <q-img
            v-for="(img, index) in images"
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
      <div class="col-auto q-mr-md" style="width: 480px">
        <q-img :src="selectedImage" class="main-img" fit="contain" />
      </div>

      <!-- Informações do produto à direita -->
      <div class="col text-left">
        <div class="q-mb-md">
          <h2 class="text-h5 q-mb-sm product-title">
            {{ product.name }}
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

          <div v-if="product.discount">
            <div class="row">
              <div class="text-body1 text-grey-6 q-mt-xs text-strike">
                {{ formatCurrency(product.price) }}
              </div>
              <div class="bg-blue-2 q-pa-xs q-ml-sm rounded-borders">
                {{ product.discount }}% OFF
              </div>
              <br />
            </div>
            <div class="text-h4 text-bold q-my-sm text-green-8">
              {{ formatCurrency(product.price - product.price * (product.discount / 100)) }}
            </div>
            <div>
              <p class="text-green-8">À vista no pix ou no cartão</p>
              <p>
                ou {{ product.quota }}x de {{ formatCurrency(product.price / product.quota) }} sem
                juros
              </p>
              <p>
                <a href="#" @click.prevent="alert = true" class="text-primary">
                  Ver formas de pagamento
                </a>
              </p>
            </div>
          </div>
          <div>
            <q-input min="1" v-model="number" type="number" style="max-width: 100px" />
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
        <div
          class="q-my-md q-pa-md bg-white rounded-borders"
          style="width: 280px; margin-left: auto"
        >
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
    </q-card>
    <q-dialog v-model="alert">
      <q-card style="max-width: 600px; width: 90vw">
        <q-card-section>
          <div class="row justify-center">
            <div class="text-h6 row items-center">
              <q-icon name="mdi-credit-card" class="q-mr-sm" size="md" color="blue-8" />
              <p class="text-grey-8 text-weight-medium q-mb-none">Formas de pagamento</p>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row items-center">
            <q-img
              fit="contain"
              src="/utils/flags/pix-banco-central-brasil-seeklogo.svg"
              alt="Pix"
              style="height: 64px; width: 64px"
              class="q-mr-lg"
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
                <!-- Parcela x Valor -->
                <td>
                  <span v-if="i === 1" class="text-green-8 text-bold">
                    {{ i }}x {{ formatCurrency(product.price - product.price * 0.1) }}
                  </span>
                  <span v-else> {{ i }}x {{ formatCurrency(product.price / i) }} </span>
                </td>
                <!-- Total -->
                <td class="text-right">
                  <span v-if="i === 1" class="text-green-8 text-bold">
                    {{ formatCurrency(product.price - product.price * 0.1) }}
                  </span>
                  <span v-else>
                    {{ formatCurrency(product.price) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <div class="row items-center q-gutter-x-sm no-wrap q-mt-md">
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

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { formatCurrency } from 'src/utils/format'
import { positiveNotify } from 'src/utils/notify'

const images = [
  '/products/split-agratto-9000/1.jpg',
  '/products/split-agratto-9000/2.jpg',
  '/products/split-agratto-9000/3.jpg',
  '/products/split-agratto-9000/4.jpg',
]

const selectedImage = ref(images[0])

const product = ref({
  name: 'Ar condicionado Split Hi Wall Inverter Agratto Liv 9.000 BTU/h Quente e Frio LCST9QF – 220 Volts',
  price: 1920,
  discount: 10,
  quota: 12,
})

const buyProduct = () => {
  positiveNotify('Produto adicionado ao carrinho!')
}

const zip_code = ref()
const number = ref(1)

export default {
  setup() {
    return {
      ratingModel: ref(0),
      images,
      selectedImage,
      product,
      formatCurrency,
      buyProduct,
      zip_code,
      number,
      // dialog
      alert: ref(false),
      confirm: ref(false),
      prompt: ref(false),

      address: ref(''),
    }
  },
}
</script>

<style lang="sass" scoped>
.thumb-img
  width: 70px
  height: 70px
  border: 2px solid #ccc
  border-radius: 0 !important
  background: #fff


.selected-thumb
  border: 2px solid #6cd47a !important


.main-img
  width: 480px
  height: 480px
  border-radius: 0 !important
  border: 1px solid #eee
  background: #fff


/* força quebra de linha no título sem estourar layout */
.product-title
  word-wrap: break-word
  word-break: break-word
  white-space: normal

.text-strike
  text-decoration: line-through
</style>
