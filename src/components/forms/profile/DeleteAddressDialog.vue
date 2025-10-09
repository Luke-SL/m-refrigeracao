<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
  >
    <q-card class="q-pa-md" style="min-width: 400px">
      <q-card-section class="text-center">
        <q-avatar size="64px" color="negative" text-color="white" class="q-mb-md">
          <q-icon name="mdi-alert" size="32px" />
        </q-avatar>
        <div class="text-h6 text-weight-medium">Excluir Endereço</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        <p class="text-body1 q-mb-sm">Tem certeza de que deseja excluir este endereço?</p>
        <p class="text-body2 text-negative text-weight-medium q-mb-sm">
          Esta ação não pode ser revertida!
        </p>
        <div
          v-if="address"
          class="text-body2 text-grey-7 q-mt-md q-pa-sm bg-grey-2 rounded-borders"
        >
          <div class="text-weight-medium">{{ address.logradouro }}, {{ address.numero }}</div>
          <div>{{ address.bairro }}, {{ address.cidade }} - {{ address.estado }}</div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pt-none">
        <q-btn
          flat
          label="Cancelar"
          color="grey-7"
          class="q-px-lg"
          @click="$emit('cancel')"
          :disable="loading"
        />
        <q-btn
          label="Excluir"
          color="negative"
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
  address: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'confirm', 'cancel'])
</script>

<style lang="sass" scoped>
.rounded-borders
  border-radius: 8px
</style>
