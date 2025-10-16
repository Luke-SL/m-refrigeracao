<template>
  <div>
    <p class="text-caption">
      Ou em até
      <span class="text-bold">{{ parcelas }}x de {{ valorParcela }}</span>
      <br />sem juros no cartão
    </p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { formatCurrency } from 'src/utils/format'

export default {
  name: 'ParcelamentoInfo',
  props: {
    preco: {
      type: Number,
      required: true,
    },
    parcelas: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const valorParcela = computed(() => {
      return formatCurrency(props.preco / props.parcelas)
    })

    return {
      valorParcela,
    }
  },
}
</script>
