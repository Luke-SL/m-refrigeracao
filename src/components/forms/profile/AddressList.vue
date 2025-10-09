<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner color="secondary" size="50px" />
      <div class="text-grey-7 q-mt-md">Carregando endereços...</div>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="addresses.length === 0" class="text-center q-py-xl">
      <q-icon name="mdi-map-marker-off" size="64px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-md">Nenhum endereço cadastrado</div>
      <div class="text-body2 text-grey-6 q-mt-sm">
        Clique no botão acima para adicionar seu primeiro endereço
      </div>
    </div>

    <!-- Lista de endereços -->
    <div v-else class="address-list">
      <q-card
        v-for="address in addresses"
        :key="address.id"
        class="address-item q-mb-md"
        bordered
        flat
      >
        <q-card-section class="row items-center">
          <div class="col cursor-pointer" @click="$emit('edit', address)">
            <div class="row items-center q-mb-xs">
              <q-icon name="mdi-map-marker" color="secondary" size="20px" class="q-mr-xs" />
              <span class="text-weight-medium">
                {{ address.logradouro }}, {{ address.numero }}
              </span>
              <q-chip
                v-if="address.endereco_padrao"
                size="sm"
                color="secondary"
                text-color="white"
                class="q-ml-sm"
              >
                Padrão
              </q-chip>
            </div>
            <div class="text-grey-7 text-body2">
              {{ address.bairro }}, {{ address.cidade }} - {{ address.estado }}
            </div>
            <div class="text-grey-6 text-caption">CEP: {{ address.cep }}</div>
          </div>
          <div class="row items-center q-gutter-xs">
            <q-btn
              flat
              round
              dense
              icon="mdi-delete"
              color="negative"
              @click="$emit('delete', address)"
            >
              <q-tooltip>Excluir endereço</q-tooltip>
            </q-btn>
            <q-icon name="mdi-chevron-right" color="grey-5" size="24px" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
defineProps({
  addresses: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'delete'])
</script>

<style lang="sass" scoped>
.address-list
  max-height: 500px
  overflow-y: auto

.address-item
  transition: all 0.3s ease
</style>
