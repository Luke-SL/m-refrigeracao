<template>
  <q-dialog :model-value="modelValue" @update:model-value="updateValue" persistent>
    <q-card class="q-pa-md" style="min-width: 400px">
      <q-card-section class="text-center">
        <q-avatar size="64px" :color="color" text-color="white" class="q-mb-md">
          <q-icon :name="icon" size="32px" />
        </q-avatar>
        <div class="text-h6 text-weight-medium">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        <p class="text-body1 q-mb-sm">{{ message }}</p>
        <p v-if="description" class="text-body2 text-grey-7">{{ description }}</p>
      </q-card-section>

      <q-card-actions align="center" class="q-pt-none">
        <q-btn
          flat
          :label="cancelLabel"
          color="grey-7"
          class="q-px-lg"
          @click="handleCancel"
          :disable="loading"
        />
        <q-btn
          :label="confirmLabel"
          :color="color"
          class="q-px-lg"
          @click="handleConfirm"
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
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'mdi-help-circle',
  },
  color: {
    type: String,
    default: 'primary',
  },
  confirmLabel: {
    type: String,
    default: 'Confirmar',
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const updateValue = (value) => {
  emit('update:modelValue', value)
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>
