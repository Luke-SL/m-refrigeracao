<template>
  <div class="price-display">
    <!-- Preço com desconto -->
    <div v-if="discount && discount > 0">
      <div class="row items-center">
        <div class="text-body1 text-grey-6 q-mt-xs text-strike">
          {{ formatCurrency(price) }}
        </div>
        <div class="bg-blue-2 q-pa-xs q-ml-sm rounded-borders">{{ discount }}% OFF</div>
      </div>
      <div class="text-h4 text-bold q-my-sm text-green-8">
        {{ formatCurrency(precoComDesconto) }}
      </div>
      <div>
        <p class="text-green-8 text-weight-medium">À vista no pix ou no cartão</p>
        <p class="text-body2">
          ou <strong>{{ quota }}x de {{ formatCurrency(parcelaComDesconto) }}</strong> sem juros
        </p>
        <p>
          <a href="#" @click.prevent="$emit('show-payment')" class="text-primary">
            Ver formas de pagamento
          </a>
        </p>
      </div>
    </div>

    <!-- Preço sem desconto -->
    <div v-else>
      <div class="text-h4 text-bold q-my-sm text-green-8">
        {{ formatCurrency(price) }}
      </div>
      <div>
        <p class="text-green-8 text-weight-medium">À vista no pix ou no cartão</p>
        <p class="text-body2">
          ou <strong>{{ quota }}x de {{ formatCurrency(parcela) }}</strong> sem juros
        </p>
        <p>
          <a href="#" @click.prevent="$emit('show-payment')" class="text-primary">
            Ver formas de pagamento
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from 'src/utils/format'

const props = defineProps({
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  quota: {
    type: Number,
    required: true,
  },
})

defineEmits(['show-payment'])

const precoComDesconto = computed(() => {
  return props.price - (props.price * props.discount) / 100
})

const parcelaComDesconto = computed(() => {
  return precoComDesconto.value / props.quota
})

const parcela = computed(() => {
  return props.price / props.quota
})
</script>

<style lang="sass" scoped>
.price-display
  width: 100%

.text-strike
  text-decoration: line-through
</style>
