<template>
  <div>
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
      <q-carousel-slide :name="1" img-src="/carousel/xo-calor.png" />
      <q-carousel-slide :name="2" img-src="/carousel/oferta-1.png" />
      <!--<q-carousel-slide :name="3" img-src="/carousel/genda.png" />-->
      <q-carousel-slide :name="4" img-src="/carousel/oferta-2.png" />
    </q-carousel>
  </div>

  <q-page class="flex">
    <div class="q-pa-md q-mx-xl">
      <q-table
        grid
        flat
        bordered
        title="Ar-Condicionado"
        :rows="rows_air_conditioner"
        :columns="columns"
        row-key="name"
        :filter="filter"
        rows-per-page-options="6"
        hide-header
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <q-card flat bordered class="q-pa-sm relative desktop-card">
              <q-img :src="props.row.imagePath" class="img-size" fit="contain" />
              <q-card-section class="card-content">
                <div>
                  <p class="text-bold text-body1">{{ truncate(props.row.productName) }}</p>
                </div>
                <div v-if="props.row.discount">
                  <div class="price-container">
                    <div class="text-body1 price-content">
                      <span class="regular-price">
                        de
                        <span class="text-strike text-bold">{{
                          formatCurrency(props.row.price)
                        }}</span>
                        por
                      </span>
                      <br />
                      <span class="text-bold text-h6 discounted-price">
                        {{
                          formatCurrency(
                            props.row.price - props.row.price * (props.row.discount / 100),
                          )
                        }}
                        <span class="text-caption">À vista</span> </span
                      ><br />
                      <span class="text-overline">{{ props.row.discount }}% de desconto</span>
                    </div>
                  </div>
                  <q-separator inset />
                  <div class="">
                    <p class="text-caption">
                      Ou em até
                      <span class="text-bold"
                        >{{ props.row.quota }}x de
                        {{ formatCurrency(props.row.price / props.row.quota) }}</span
                      >
                      <br />sem juros no cartão
                    </p>
                  </div>
                </div>
                <div v-else>
                  <div class="price-container">
                    <div class="text-body1 price-content">
                      <span class="text-bold text-h6 discounted-price"
                        >{{ formatCurrency(props.row.price) }}
                        <span class="text-caption">À vista</span>
                      </span>
                    </div>
                  </div>
                  <q-separator inset class="" />
                  <div class="">
                    <p class="text-caption">
                      Ou em até
                      <span class="text-bold"
                        >{{ props.row.quota }}x de
                        {{ formatCurrency(props.row.price / props.row.quota) }}</span
                      >
                      <br />sem juros no cartão
                    </p>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
        <template v-slot:bottom></template>
      </q-table>
    </div>
    <div class="q-pa-md q-mx-xl">
      <q-table
        grid
        flat
        bordered
        title="Ventiladores"
        :rows="rows_fan"
        :columns="columns"
        row-key="name"
        :filter="filter"
        rows-per-page-options="6"
        hide-header
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <q-card flat bordered class="q-pa-sm relative desktop-card">
              <q-img :src="props.row.imagePath" class="img-size" fit="contain" />
              <q-card-section class="card-content">
                <div>
                  <p class="text-bold text-body1">{{ truncate(props.row.productName) }}</p>
                </div>
                <div v-if="props.row.discount">
                  <div class="price-container">
                    <div class="text-body1 price-content">
                      <span class="regular-price">
                        de
                        <span class="text-strike text-bold">{{
                          formatCurrency(props.row.price)
                        }}</span>
                        por
                      </span>
                      <br />
                      <span class="text-bold text-h6 discounted-price">
                        {{
                          formatCurrency(
                            props.row.price - props.row.price * (props.row.discount / 100),
                          )
                        }}
                        <span class="text-caption">À vista</span> </span
                      ><br />
                      <span class="text-overline">{{ props.row.discount }}% de desconto</span>
                    </div>
                  </div>
                  <q-separator inset />
                  <div class="">
                    <p class="text-caption">
                      Ou em até
                      <span class="text-bold"
                        >{{ props.row.quota }}x de
                        {{ formatCurrency(props.row.price / props.row.quota) }}</span
                      >
                      <br />sem juros no cartão
                    </p>
                  </div>
                </div>
                <div v-else>
                  <div class="price-container">
                    <div class="text-body1 price-content">
                      <span class="text-bold text-h6 discounted-price"
                        >{{ formatCurrency(props.row.price) }}
                        <span class="text-caption">À vista</span>
                      </span>
                    </div>
                  </div>
                  <q-separator inset class="" />
                  <div class="">
                    <p class="text-caption">
                      Ou em até
                      <span class="text-bold"
                        >{{ props.row.quota }}x de
                        {{ formatCurrency(props.row.price / props.row.quota) }}</span
                      >
                      <br />sem juros no cartão
                    </p>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
        <template v-slot:bottom></template>
      </q-table>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>
.desktop-card
  width: 100%   // ocupar a largura da coluna responsiva
  max-width: 450px
  height: 92%
  max-height: 600px

.card-content
  display: flex
  flex-direction: column
  height: 100%

.price-container
  height: 90px  // Altura fixa para o container do preço
  display: flex
  align-items: center  // Centraliza verticalmente
  justify-content: flex-start  // Alinha à esquerda

.price-content
  width: 100%

.regular-price
  color: #0D47A1

.discounted-price
  color: green

.text-strike
  text-decoration: line-through

.img-size
  max-width: 450px
  max-height: 200px

:deep(.q-table__title)
  color: #374151   // vermelho
  font-weight: bold
  font-size: 22px
</style>

<script>
import { ref } from 'vue'
import { formatCurrency } from 'src/utils/format'

const columns = [
  {
    name: 'image-path',
    required: true,
    label: 'Image',
    align: 'center',
    field: (row) => row.imagePath,
    sortable: true,
  },
  {
    name: 'product-name',
    required: true,
    label: 'Product Name',
    align: 'left',
    field: (row) => row.productName,
    sortable: true,
  },
  {
    name: 'price',
    required: true,
    label: 'Price',
    align: 'left',
    field: (row) => row.price,
    sortable: true,
  },
  {
    name: 'discount',
    required: true,
    label: 'Discount',
    align: 'left',
    field: (row) => row.discount,
    sortable: true,
  },
  {
    name: 'quota',
    required: true,
    label: 'Quota',
    align: 'left',
    field: (row) => row.quota,
    sortable: true,
  },
]

const rows_air_conditioner = [
  {
    imagePath: '/products/lg-hi-wall/1.jpg',
    productName: 'Ar condicionado LG HI Wall Split Dual Inverter 9.000 BTUs',
    price: 2156.84,
    discount: 10,
    quota: 12,
  },
  {
    imagePath: '/products/split-agratto-9000/1.jpg',
    productName:
      'Ar condicionado Split Hi Wall Inverter Agratto Liv 9.000 BTU/h Quente e Frio LCST9QF – 220 Volts',
    price: 1920.0,
    discount: 10,
    quota: 12,
  },
  {
    imagePath: '/products/ar-condicionado-split-samsung-9000/1.webp',
    productName: "Ar-condicionado Split Samsung 9000 BTU's Inverter WindFree AI - AR09DY - 220V",
    price: 3729.9,
    discount: null,
    quota: 12,
  },
  {
    imagePath: '/products/ar-condicionado-split-elgin-9000/1.webp',
    productName:
      'Ar Condicionado Split Elgin 9000 BTUs Inverter Eco II Connect - HJFE09C2CC - 220V',
    price: 1899.9,
    discount: 13,
    quota: 10,
  },
  {
    imagePath: '/products/ar-condicionado-split-gree-12000/1.webp',
    productName: 'Ar Condicionado Split Gree 12000BTUs Auto Inverter 220V Branco CB574N09200',
    price: 3429.9,
    discount: null,
    quota: 12,
  },
  {
    imagePath: '/products/ar-condicionado-split-lg-dual/1.webp',
    productName:
      'Ar-Condicionado Split LG DUAL Inverter Compact +AI 9.000 BTU Frio – S3-Q09AAQAL - 220V',
    price: 2449.9,
    discount: 13,
    quota: 12,
  },
]

const rows_fan = [
  {
    imagePath: '/products/ventilador-arno-de-mesa-e-parede-40cm-6-pas/1.webp',
    productName: 'Ventilador Arno de Mesa e Parede 40cm 6 Pás X-TREME 6 140W 220V Preto - VE60',
    price: 299.9,
    discount: 34,
    quota: 10,
  },
  {
    imagePath: 'products/ventilador-arno-x-treme-7-mesa-3-velocidades-40cm-preto-220v-ve70/1.webp',
    productName: 'Ventilador Arno X-treme 7 Mesa 3 Velocidades 40cm Preto 220V - VE70',
    price: 299.9,
    discount: 5,
    quota: 10,
  },
  {
    imagePath: '/products/ventilador-britania-2-em-1-maxx-force-150w-40cm-127v-bvt400/1.webp',
    productName: 'Ventilador Britânia 2 em 1 Maxx Force 150W 40cm 127V - BVT400',
    price: 249.9,
    discount: 20,
    quota: 10,
  },
  {
    imagePath: '/products/ventilador-de-mesa-3-velocidades-220V/1.webp',
    productName: 'Ventilador de Mesa 3 Velocidades 220V VSP30W Branco - Mondial',
    price: 127.9,
    discount: 13,
    quota: 10,
  },
  {
    imagePath:
      '/products/ventilador-de-mesa-cadence-3-velocidades-40cm-140w-preto-220v-vtr410/1.webp',
    productName: 'Ventilador de Mesa Cadence 3 Velocidades 40cm 140W Preto 220V - VTR410',
    price: 159.9,
    discount: null,
    quota: 10,
  },
  {
    imagePath: '/products/ventilador-de-mesa-mondial-50cm-com-3-velocidades/1.webp',
    productName: 'Ventilador de Mesa Mondial 50cm com 3 Velocidades 220V VTX-50-8P',
    price: 219.9,
    discount: 13,
    quota: 10,
  },
]

const truncate = (text, length = 70) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export default {
  setup() {
    return {
      slide: ref(1),
      autoplay: ref(true),
      filter: ref(''),
      columns,
      rows_air_conditioner,
      rows_fan,
      formatCurrency,
      truncate,
    }
  },
}
</script>
