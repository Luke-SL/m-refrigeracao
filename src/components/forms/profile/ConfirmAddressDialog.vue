<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="q-pa-md" style="min-width: 400px">
      <q-card-section class="text-center">
        <q-avatar size="64px" color="secondary" text-color="white" class="q-mb-md">
          <q-icon name="mdi-map-marker-check" size="32px" />
        </q-avatar>
        <div class="text-h6 text-weight-medium">
          Confirmar {{ editing ? 'atualização' : 'novo endereço' }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        <p class="text-body1 q-mb-sm">
          Tem certeza de que deseja {{ editing ? 'atualizar' : 'adicionar' }} este endereço?
        </p>
        <p class="text-body2 text-grey-7">
          {{
            editing
              ? 'As informações do endereço serão alteradas.'
              : 'Um novo endereço será adicionado.'
          }}
        </p>
      </q-card-section>

      <q-card-actions align="center" class="q-pt-none">
        <q-btn
          flat
          label="Cancelar"
          color="grey-7"
          class="q-px-lg"
          @click="$emit('update:modelValue', false)"
          :disable="loading"
        />
        <q-btn
          :label="editing ? 'Atualizar' : 'Adicionar'"
          color="secondary"
          class="q-px-lg"
          @click="$emit('confirm')"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  editing: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'confirm'])
</script>
