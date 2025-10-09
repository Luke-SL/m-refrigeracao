<template>
  <div>
    <div class="q-mb-xl">
      <q-btn
        outline
        color="secondary"
        label="Voltar"
        icon="mdi-arrow-left"
        @click="$emit('cancel')"
      />
    </div>

    <q-form @submit.prevent="$emit('submit')" class="q-gutter-md">
      <!-- CEP -->
      <div class="form-row">
        <q-input
          :model-value="modelValue.cep"
          @update:model-value="onCepChange"
          label="CEP *"
          outlined
          mask="#####-###"
          unmasked-value
          class="form-input-full"
          :rules="cepRules"
          :loading="loadingCep"
        />
      </div>

      <!-- Logradouro -->
      <div class="form-row">
        <q-input
          :model-value="modelValue.logradouro"
          @update:model-value="updateField('logradouro', $event)"
          label="Logradouro *"
          outlined
          class="form-input-full"
          :rules="[(val) => !!val || 'Logradouro é obrigatório']"
        />
      </div>

      <!-- Número e Complemento -->
      <div class="form-row">
        <q-input
          :model-value="modelValue.numero"
          @update:model-value="updateField('numero', $event)"
          label="Número *"
          outlined
          class="form-input form-input-number"
          :rules="[(val) => !!val || 'Número é obrigatório']"
        />
        <q-input
          :model-value="modelValue.complemento"
          @update:model-value="updateField('complemento', $event)"
          label="Complemento"
          outlined
          class="form-input form-input-complement"
        />
      </div>

      <!-- Bairro -->
      <div class="form-row">
        <q-input
          :model-value="modelValue.bairro"
          @update:model-value="updateField('bairro', $event)"
          label="Bairro *"
          outlined
          class="form-input-full"
          :rules="[(val) => !!val || 'Bairro é obrigatório']"
        />
      </div>

      <!-- Cidade e Estado -->
      <div class="form-row">
        <q-input
          :model-value="modelValue.cidade"
          @update:model-value="updateField('cidade', $event)"
          label="Cidade *"
          outlined
          class="form-input form-input-city"
          :rules="[(val) => !!val || 'Cidade é obrigatória']"
        />
        <q-select
          :model-value="modelValue.estado"
          @update:model-value="updateField('estado', $event)"
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
          :model-value="modelValue.enderecoPadrao"
          @update:model-value="updateField('enderecoPadrao', $event)"
          label="Tornar este meu endereço padrão"
          class="form-input-full"
        />
      </div>

      <!-- Botão Adicionar/Atualizar Endereço -->
      <div class="flex flex-center q-mt-lg">
        <q-btn
          type="submit"
          :label="editing ? 'Atualizar Endereço' : 'Adicionar Endereço'"
          color="secondary"
          size="xl"
          class="q-px-xl submit-btn q-mt-sm"
          :loading="loading"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  editing: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingCep: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'search-cep'])

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
  (val) => val.replace(/\D/g, '').length === 8 || 'CEP deve ter 8 dígitos',
]

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const onCepChange = (value) => {
  updateField('cep', value)
  const cep = value.replace(/\D/g, '')
  if (cep.length === 8) {
    emit('search-cep')
  }
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
