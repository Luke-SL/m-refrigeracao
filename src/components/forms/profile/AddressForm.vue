<template>
  <div>
    <div class="q-mb-xl">
      <q-btn
        outline
        color="secondary"
        label="Voltar"
        icon="mdi-arrow-left"
        @click="emit('cancel')"
      />
    </div>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <!-- CEP -->
      <div class="form-row">
        <q-input
          v-model="form.cep"
          label="CEP *"
          outlined
          mask="#####-###"
          unmasked-value
          class="form-input-full"
          :rules="cepRules"
          @blur="buscarCep"
          :loading="loadingCep"
        >
          <template v-slot:append>
            <q-icon
              v-if="!loadingCep"
              name="mdi-map-search"
              color="secondary"
              class="cursor-pointer"
              @click="buscarCep"
            >
              <q-tooltip>Buscar CEP</q-tooltip>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Logradouro -->
      <div class="form-row">
        <q-input
          v-model="form.logradouro"
          label="Logradouro *"
          outlined
          class="form-input-full"
          :rules="[(val) => !!val || 'Logradouro é obrigatório']"
        />
      </div>

      <!-- Número e Complemento -->
      <div class="form-row">
        <q-input
          v-model="form.numero"
          label="Número *"
          outlined
          class="form-input form-input-number"
          :rules="[(val) => !!val || 'Número é obrigatório']"
        />
        <q-input
          v-model="form.complemento"
          label="Complemento"
          outlined
          class="form-input form-input-complement"
          hint="Apto, Bloco, etc."
        />
      </div>

      <!-- Bairro -->
      <div class="form-row">
        <q-input
          v-model="form.bairro"
          label="Bairro *"
          outlined
          class="form-input-full"
          :rules="[(val) => !!val || 'Bairro é obrigatório']"
        />
      </div>

      <!-- Cidade e Estado -->
      <div class="form-row">
        <q-input
          v-model="form.cidade"
          label="Cidade *"
          outlined
          class="form-input form-input-city"
          :rules="[(val) => !!val || 'Cidade é obrigatória']"
        />
        <q-select
          v-model="form.estado"
          :options="estados"
          label="Estado *"
          outlined
          class="form-input form-input-state"
          emit-value
          map-options
          :rules="[(val) => !!val || 'Estado é obrigatório']"
        />
      </div>

      <!-- Checkbox Endereço Padrão -->
      <div class="form-row">
        <q-checkbox
          v-model="form.enderecoPadrao"
          label="Tornar este meu endereço padrão"
          color="secondary"
          class="form-input-full"
        >
          <q-tooltip v-if="!form.enderecoPadrao">
            O endereço padrão será usado automaticamente em novos pedidos
          </q-tooltip>
        </q-checkbox>
      </div>

      <!-- Botão Adicionar/Atualizar Endereço -->
      <div class="flex flex-center q-mt-lg">
        <q-btn
          type="submit"
          :label="isEditing ? 'Atualizar Endereço' : 'Adicionar Endereço'"
          :icon="isEditing ? 'mdi-check' : 'mdi-plus'"
          color="secondary"
          size="xl"
          class="q-px-xl submit-btn q-mt-sm"
          :loading="loading"
          unelevated
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { negativeNotify } from 'src/composables/UseNotify'

const props = defineProps({
  initialData: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const loadingCep = ref(false)

const form = reactive({
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  enderecoPadrao: false,
})

// Atualizar formulário quando os dados iniciais mudarem
watch(
  () => props.initialData,
  (newData) => {
    Object.assign(form, newData)
  },
  { immediate: true, deep: true },
)

const estados = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' },
]

const cepRules = [
  (val) => !!val || 'CEP é obrigatório',
  (val) => {
    const cleanCep = val?.replace(/\D/g, '') || ''
    return cleanCep.length === 8 || 'CEP deve ter 8 dígitos'
  },
]

const buscarCep = async () => {
  const cep = form.cep?.replace(/\D/g, '') || ''

  if (cep.length !== 8) {
    return
  }

  loadingCep.value = true

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`)
    }

    const data = await response.json()

    if (data.erro) {
      negativeNotify('CEP não encontrado')
      return
    }

    // Preencher campos automaticamente
    form.logradouro = data.logradouro || ''
    form.bairro = data.bairro || ''
    form.cidade = data.localidade || ''
    form.estado = data.uf || ''

    // Se o CEP retornou dados, focar no campo número
    if (data.logradouro) {
      // Pequeno delay para garantir que os campos foram atualizados
      setTimeout(() => {
        const numeroInput = document.querySelector('input[aria-label="Número *"]')
        numeroInput?.focus()
      }, 100)
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    negativeNotify('Erro ao buscar CEP. Verifique sua conexão e tente novamente.')
  } finally {
    loadingCep.value = false
  }
}

const onSubmit = () => {
  // Validação adicional antes de enviar
  if (
    !form.cep ||
    !form.logradouro ||
    !form.numero ||
    !form.bairro ||
    !form.cidade ||
    !form.estado
  ) {
    negativeNotify('Por favor, preencha todos os campos obrigatórios')
    return
  }

  emit('submit', { ...form })
}
</script>

<style lang="sass" scoped>
.form-row
  display: flex
  gap: 0.5rem
  width: 100%

.form-input
  flex: 1

.form-input-full
  width: 100%

.form-input-number
  flex: 0 0 30%

.form-input-complement
  flex: 1

.form-input-city
  flex: 1

.form-input-state
  flex: 0 0 30%

.submit-btn
  min-width: 200px

@media (max-width: 768px)
  .form-row
    flex-direction: column
    gap: 1rem

  .form-input,
  .form-input-full,
  .form-input-number,
  .form-input-complement,
  .form-input-city,
  .form-input-state
    width: 100%
    flex: none

  .submit-btn
    width: 100%
    max-width: 300px

@media (max-width: 480px)
  .submit-btn
    min-width: auto
    width: 100%
</style>
