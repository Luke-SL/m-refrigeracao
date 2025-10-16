<template>
  <div class="q-pa-md q-mx-xl">
    <q-table
      grid
      flat
      bordered
      :title="title"
      :rows="produtos"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[6]"
      hide-header
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-2">
          <q-card
            flat
            bordered
            class="q-pa-sm relative desktop-card cursor-pointer"
            @click="$emit('product-click', props.row)"
          >
            <q-img :src="props.row.imagePath" class="img-size" fit="contain" />
            <q-card-section class="card-content">
              <div>
                <p class="text-bold text-body1">{{ truncate(props.row.productName) }}</p>
              </div>

              <!-- Preço com desconto -->
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
                      {{ calcularPrecoComDesconto(props.row) }}
                      <span class="text-caption">À vista</span>
                    </span>
                    <br />
                    <span class="text-overline">{{ props.row.discount }}% de desconto</span>
                  </div>
                </div>
                <ParcelamentoInfo :preco="props.row.price" :parcelas="props.row.quota" />
              </div>

              <!-- Preço sem desconto -->
              <div v-else>
                <div class="price-container">
                  <div class="text-body1 price-content">
                    <span class="text-bold text-h6 discounted-price">
                      {{ formatCurrency(props.row.price) }}
                      <span class="text-caption">À vista</span>
                    </span>
                  </div>
                </div>
                <ParcelamentoInfo :preco="props.row.price" :parcelas="props.row.quota" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <template v-slot:bottom></template>
    </q-table>
  </div>
</template>

<style lang="sass" scoped>
.desktop-card
  width: 100%
  max-width: 500px
  height: 92%
  max-height: 600px
  transition: transform 0.2s ease, box-shadow 0.2s ease

  &:hover
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
import { formatCurrency } from 'src/utils/format'
import ParcelamentoInfo from './ParcelamentoInfo.vue'

const truncate = (text, length = 70) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export default {
  name: 'ProductSection',
  components: {
    ParcelamentoInfo,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    produtos: {
      type: Array,
      required: true,
    },
  },
  emits: ['product-click'],
  setup() {
    const columns = [{ name: 'productName', label: 'Produto', field: 'productName' }]

    const calcularPrecoComDesconto = (produto) => {
      const precoComDesconto = produto.price - produto.price * (produto.discount / 100)
      return formatCurrency(precoComDesconto)
    }

    return {
      columns,
      formatCurrency,
      truncate,
      calcularPrecoComDesconto,
    }
  },
}
</script>
