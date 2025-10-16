<template>
  <div class="frete-calculator">
    <!-- Input de CEP -->
    <div class="cep-input-wrapper">
      <q-input
        class="cep-input"
        v-model="cep"
        outlined
        dense
        label="Calcular frete e prazo"
        mask="##.###-###"
        placeholder="__.___-___"
        unmasked-value
        :error="!!errorFrete && !loadingFrete"
        :error-message="errorFrete"
        @keyup.enter="calcular"
      >
        <template v-slot:prepend>
          <q-icon name="mdi-truck-delivery" color="primary" />
        </template>
        <template v-slot:append>
          <q-btn
            flat
            dense
            round
            icon="search"
            color="primary"
            :loading="loadingFrete"
            :disable="cep.replace(/\D/g, '').length !== 8"
            @click="calcular"
          >
            <q-tooltip>Calcular frete</q-tooltip>
          </q-btn>
        </template>
      </q-input>

      <!-- Link "Não sei meu CEP" -->
      <div class="q-mt-xs">
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          class="text-caption text-primary"
        >
          Não sei meu CEP
        </a>
      </div>
    </div>

    <!-- Endereço encontrado -->
    <q-slide-transition>
      <div v-if="enderecoCompleto && !loadingFrete" class="q-mt-md">
        <q-banner rounded class="bg-blue-1 text-blue-9">
          <template v-slot:avatar>
            <q-icon name="mdi-map-marker" color="blue-9" />
          </template>
          <div class="text-caption">
            <strong>{{ enderecoCompleto.cidade }} - {{ enderecoCompleto.estado }}</strong>
            <div v-if="enderecoCompleto.bairro">{{ enderecoCompleto.bairro }}</div>
          </div>
        </q-banner>
      </div>
    </q-slide-transition>

    <!-- Opções de frete -->
    <q-slide-transition>
      <div v-if="fretesDisponiveis.length > 0" class="fretes-list q-mt-md">
        <div class="text-subtitle2 text-grey-8 q-mb-sm">Opções de entrega disponíveis:</div>

        <q-card
          v-for="frete in fretesDisponiveis"
          :key="frete.id"
          flat
          bordered
          class="frete-option q-mb-sm"
          :class="{ 'frete-selected': freteEscolhido?.id === frete.id }"
          @click="selecionarFrete(frete)"
        >
          <q-card-section class="row items-center q-pa-md cursor-pointer">
            <!-- Radio button -->
            <div class="col-auto q-mr-md">
              <q-radio
                :model-value="freteEscolhido?.id"
                :val="frete.id"
                color="primary"
                @update:model-value="selecionarFrete(frete)"
              />
            </div>

            <!-- Ícone do tipo de frete -->
            <div class="col-auto q-mr-md">
              <q-avatar :color="getFreteColor(frete.tipo)" text-color="white" size="40px">
                <q-icon :name="getFreteIcon(frete.tipo)" />
              </q-avatar>
            </div>

            <!-- Informações do frete -->
            <div class="col">
              <div class="text-weight-bold text-body1">
                {{ frete.nome }}
              </div>
              <div class="text-caption text-grey-7">
                {{ frete.servico }}
              </div>
              <div class="text-caption text-grey-8 q-mt-xs">
                <q-icon name="mdi-clock-outline" size="14px" />
                Entrega em até
                <strong>{{ frete.prazo }} dia{{ frete.prazo > 1 ? 's' : '' }} úteis</strong>
              </div>
            </div>

            <!-- Valor -->
            <div class="col-auto text-right">
              <div class="text-h6 text-weight-bold text-primary">
                {{ frete.valor === 0 ? 'GRÁTIS' : formatCurrency(frete.valor) }}
              </div>
              <q-badge
                v-if="frete.tipo === 'expresso'"
                color="orange"
                label="Mais rápido"
                class="q-mt-xs"
              />
              <q-badge
                v-else-if="frete.tipo === 'economico'"
                color="green"
                label="Mais barato"
                class="q-mt-xs"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Frete grátis progressivo (opcional) -->
        <div v-if="mostrarFreteGratis" class="q-mt-md">
          <q-banner rounded class="bg-green-1 text-green-9">
            <template v-slot:avatar>
              <q-icon name="mdi-gift" color="green-9" />
            </template>
            <div class="text-caption">
              <strong>Frete grátis</strong> em compras acima de
              <strong>{{ formatCurrency(valorFreteGratis) }}</strong
              >!
            </div>
            <div v-if="valorParaFreteGratis > 0" class="text-caption q-mt-xs">
              Faltam apenas {{ formatCurrency(valorParaFreteGratis) }} para você ganhar frete
              grátis!
            </div>
          </q-banner>
        </div>
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCalculoFrete } from 'src/composables/useCalculoFrete'
import { formatCurrency } from 'src/utils/format'

const props = defineProps({
  produto: {
    type: Object,
    required: true,
  },
  valorFreteGratis: {
    type: Number,
    default: 500, // R$ 500 para frete grátis
  },
  mostrarFreteGratis: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['frete-selecionado'])

const cep = ref('')
const freteEscolhido = ref(null)

const {
  fretesDisponiveis,
  loadingFrete,
  errorFrete,
  enderecoCompleto,
  simularFrete, // Use calcularFrete quando tiver API real
  limparFrete,
} = useCalculoFrete()

// Valor que falta para frete grátis
const valorParaFreteGratis = computed(() => {
  const valorProduto = props.produto.discount
    ? props.produto.price - (props.produto.price * props.produto.discount) / 100
    : props.produto.price

  const falta = props.valorFreteGratis - valorProduto
  return falta > 0 ? falta : 0
})

const calcular = async () => {
  if (cep.value.replace(/\D/g, '').length !== 8) return

  freteEscolhido.value = null

  // Use simularFrete durante desenvolvimento
  // Troque por calcularFrete quando tiver API real
  const resultado = await simularFrete(cep.value, props.produto)

  if (resultado.sucesso && fretesDisponiveis.value.length > 0) {
    // Auto-seleciona o frete mais barato
    freteEscolhido.value = fretesDisponiveis.value[0]
    emit('frete-selecionado', freteEscolhido.value)
  }
}

const selecionarFrete = (frete) => {
  freteEscolhido.value = frete
  emit('frete-selecionado', frete)
}

const getFreteIcon = (tipo) => {
  const icons = {
    expresso: 'mdi-rocket',
    economico: 'mdi-package-variant',
    normal: 'mdi-truck',
  }
  return icons[tipo] || 'mdi-truck'
}

const getFreteColor = (tipo) => {
  const colors = {
    expresso: 'orange',
    economico: 'green',
    normal: 'primary',
  }
  return colors[tipo] || 'primary'
}

// Limpa ao desmontar
defineExpose({
  limparFrete,
  cep,
  freteEscolhido,
})
</script>

<style lang="sass" scoped>
.frete-calculator
  width: 100%

.cep-input-wrapper
  width: 100%

.fretes-list
  width: 100%

.frete-option
  transition: all 0.2s ease
  cursor: pointer

  &:hover
    border-color: #1976d2
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15)

.frete-selected
  border-color: #1976d2 !important
  background-color: rgba(25, 118, 210, 0.05)
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2)

.cep-input
  max-width: 230px
</style>
