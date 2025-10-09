<template>
  <div class="form-card">
    <q-card class="q-pa-lg shadow-2 rounded-borders update-card">
      <!-- Ícone no topo -->
      <q-card-section class="text-center">
        <q-avatar size="64px" color="secondary" text-color="white">
          <q-icon name="mdi-map-marker-plus" size="32px" />
        </q-avatar>
        <div class="text-h6 text-secondary q-mt-sm">Endereços</div>
      </q-card-section>

      <!-- Lista de Endereços -->
      <q-card-section v-if="!showAddressForm">
        <div class="q-mb-md">
          <q-btn
            outline
            color="secondary"
            label="Cadastrar novo endereço"
            icon="mdi-plus"
            @click="showNewAddressForm"
            class="full-width"
          />
        </div>

        <AddressList
          :addresses="addressList"
          :loading="loadingAddressList"
          @edit="editAddress"
          @delete="showDeleteDialog"
        />
      </q-card-section>

      <!-- Formulário de Endereço -->
      <q-card-section v-else>
        <AddressForm
          v-model="addressForm"
          :editing="!!editingAddress"
          :loading="loadingAddress"
          :loading-cep="loadingCep"
          @submit="showAddressConfirmDialog"
          @cancel="backToAddressList"
          @search-cep="buscarCep"
        />
      </q-card-section>
    </q-card>

    <!-- Dialog de Confirmação do Endereço -->
    <ConfirmAddressDialog
      v-model="addressConfirmDialog"
      :editing="!!editingAddress"
      :loading="loadingAddress"
      @confirm="onSubmitAddress"
    />

    <!-- Dialog de Confirmação de Exclusão -->
    <DeleteAddressDialog
      v-model="deleteDialog"
      :address="addressToDelete"
      :loading="loadingDelete"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'
import useAdressUser from 'src/composables/useAdressUser'
import AddressList from './AddressList.vue'
import AddressForm from './AddressForm.vue'
import ConfirmAddressDialog from './ConfirmAddressDialog.vue'
import DeleteAddressDialog from './DeleteAddressDialog.vue'

const { addAdress, getAdress, updateAdress, deleteAdress } = useAdressUser()

const loadingAddress = ref(false)
const loadingCep = ref(false)
const loadingDelete = ref(false)
const addressConfirmDialog = ref(false)
const deleteDialog = ref(false)
const showAddressForm = ref(false)
const addressList = ref([])
const loadingAddressList = ref(false)
const editingAddress = ref(null)
const addressToDelete = ref(null)

const addressForm = reactive({
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  enderecoPadrao: false,
})

onMounted(async () => {
  await loadAddresses()
})

const loadAddresses = async () => {
  loadingAddressList.value = true
  try {
    addressList.value = await getAdress()
  } catch (error) {
    console.error('Erro ao carregar endereços:', error)
    negativeNotify('Erro ao carregar endereços')
  } finally {
    loadingAddressList.value = false
  }
}

const showNewAddressForm = () => {
  editingAddress.value = null
  resetAddressForm()
  showAddressForm.value = true
}

const editAddress = (address) => {
  editingAddress.value = address
  addressForm.cep = address.cep || ''
  addressForm.logradouro = address.logradouro || ''
  addressForm.numero = address.numero || ''
  addressForm.complemento = address.complemento || ''
  addressForm.bairro = address.bairro || ''
  addressForm.cidade = address.cidade || ''
  addressForm.estado = address.estado || ''
  addressForm.enderecoPadrao = address.endereco_padrao || false
  showAddressForm.value = true
}

const resetAddressForm = () => {
  addressForm.cep = ''
  addressForm.logradouro = ''
  addressForm.numero = ''
  addressForm.complemento = ''
  addressForm.bairro = ''
  addressForm.cidade = ''
  addressForm.estado = ''
  addressForm.enderecoPadrao = false
}

const backToAddressList = () => {
  showAddressForm.value = false
  editingAddress.value = null
  resetAddressForm()
}

const buscarCep = async () => {
  const cep = addressForm.cep.replace(/\D/g, '')
  if (cep.length === 8) {
    loadingCep.value = true
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data = await response.json()

      if (!data.erro) {
        Object.assign(addressForm, {
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        })
      } else {
        negativeNotify('CEP não encontrado')
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      negativeNotify('Erro ao buscar CEP. Verifique sua conexão e tente novamente.')
    } finally {
      loadingCep.value = false
    }
  }
}

const showAddressConfirmDialog = () => {
  addressConfirmDialog.value = true
}

const showDeleteDialog = (address) => {
  addressToDelete.value = address
  deleteDialog.value = true
}

const cancelDelete = () => {
  deleteDialog.value = false
  addressToDelete.value = null
}

const confirmDelete = async () => {
  if (!addressToDelete.value) return

  loadingDelete.value = true
  try {
    await deleteAdress(addressToDelete.value.id)
    positiveNotify('Endereço excluído com sucesso!')
    deleteDialog.value = false
    addressToDelete.value = null
    await loadAddresses()
  } catch (error) {
    negativeNotify(error.message || 'Erro ao excluir endereço')
  } finally {
    loadingDelete.value = false
  }
}

const onSubmitAddress = async () => {
  loadingAddress.value = true
  try {
    const addressData = {
      cep: addressForm.cep,
      logradouro: addressForm.logradouro,
      numero: addressForm.numero,
      complemento: addressForm.complemento,
      bairro: addressForm.bairro,
      cidade: addressForm.cidade,
      estado: addressForm.estado,
      endereco_padrao: addressForm.enderecoPadrao,
    }

    if (editingAddress.value) {
      await updateAdress(editingAddress.value.id, addressData)
      positiveNotify('Endereço atualizado com sucesso!')
    } else {
      await addAdress(addressData)
      positiveNotify('Endereço adicionado com sucesso!')
    }

    addressConfirmDialog.value = false
    showAddressForm.value = false
    resetAddressForm()
    editingAddress.value = null
    await loadAddresses()
  } catch (error) {
    negativeNotify(error.message)
    addressConfirmDialog.value = false
  }
  loadingAddress.value = false
}
</script>

<style lang="sass" scoped>
.rounded-borders
  border-radius: 16px

.form-card
  display: flex
  justify-content: center

.update-card
  width: 100%
  max-width: 600px
  height: fit-content

@media (max-width: 1023px)
  .form-card
    width: 100%
    max-width: 600px

  .update-card
    width: 100%
</style>
