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
          <div class="row" v-if="product.discount">
            <div class="text-body1 text-grey-6 q-mt-xs text-strike">
              {{ formatCurrency(product.price) }}
            </div>
            <div class="bg-blue-2 q-pa-xs q-ml-sm rounded-borders">{{ product.discount }}% OFF</div>
          </div>
        </div>

        <q-btn
          color="primary"
          unelevated
          size="lg"
          label="Comprar"
          class="full-width"
          @click="buyProduct"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { formatCurrency } from 'src/utils/format'

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
  alert('Produto adicionado ao carrinho!')
}

export default {
  setup() {
    return {
      images,
      selectedImage,
      product,
      formatCurrency,
      buyProduct,
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
