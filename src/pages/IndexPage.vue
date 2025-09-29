<template>
  <div>
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      class="carousel-fullwidth"
      height="56.25vw"
    >
      <q-carousel-slide
        :name="1"
        class="flex items-center justify-center"
        img-src="/carousel/xo-calor.png"
      />
      <q-carousel-slide
        :name="2"
        class="flex items-center justify-center"
        img-src="/carousel/oferta-1.png"
      />
      <q-carousel-slide
        :name="4"
        class="flex items-center justify-center"
        img-src="/carousel/oferta-2.png"
      />
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
        :rows-per-page-options="[6]"
        hide-header
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <q-card
              flat
              bordered
              class="q-pa-sm relative desktop-card cursor-pointer"
              @click="goToProduct(props.row)"
            >
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
        :rows-per-page-options="[6]"
        hide-header
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2">
            <q-card
              flat
              bordered
              class="q-pa-sm relative desktop-card cursor-pointer"
              @click="goToProduct(props.row)"
            >
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
.carousel-fullwidth
  width: 100%;
  height: 56.25vw;
  max-height: 350px; /* diminuído de 600px para 400px */


.carousel-fullwidth
  :deep(.q-carousel__slide)
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;




.carousel-custom
  :deep(.q-carousel__slide)
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;

.desktop-card
  width: 100%
  max-width: 500px
  height: 92%
  max-height: 600px
  transition: transform 0.2s ease, box-shadow 0.2s ease

.desktop-card:hover
  transform: translateY(-4px)
  box-shadow: 0 8px 16px rgba(0,0,0,0.15)

.card-content
  display: flex
  flex-direction: column
  height: 100%

.price-container
  height: 90px
  display: flex
  align-items: center
  justify-content: flex-start

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
  color: #374151
  font-weight: bold
  font-size: 22px
</style>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency } from 'src/utils/format'
import { rows_air_conditioner, rows_fan, columns } from './products-list'

const truncate = (text, length = 70) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export default {
  setup() {
    const router = useRouter()

    const goToProduct = (product) => {
      // Salva o produto no localStorage para acessar na página de produto
      localStorage.setItem('selectedProduct', JSON.stringify(product))
      router.push(`/product/${product.id}`)
    }

    return {
      slide: ref(1),
      autoplay: ref(true),
      filter: ref(''),
      columns,
      rows_air_conditioner,
      rows_fan,
      formatCurrency,
      truncate,
      goToProduct,
    }
  },
}
</script>
