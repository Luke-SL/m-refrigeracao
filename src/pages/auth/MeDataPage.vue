<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md">
    <template>
      <q-page class="flex flex-center bg-grey-2 q-pa-md">
        <!-- Loading inicial -->
        <div v-if="loadingProfile" class="text-center q-py-xl">
          <q-spinner color="primary" size="50px" />
          <div class="text-h6 text-grey-7 q-mt-md">Carregando dados...</div>
        </div>

        <!-- Conteúdo principal -->
        <div v-else class="form-container">
          <!-- ... resto do template ... -->
        </div>
      </q-page>
    </template>
    <div class="form-container">
      <!-- Card de Dados Pessoais -->
      <div class="form-card">
        <q-card class="q-pa-lg shadow-2 rounded-borders update-card">
          <!-- Ícone no topo -->
          <q-card-section class="text-center">
            <q-avatar size="64px" color="primary" text-color="white">
              <q-icon name="mdi-account-edit" size="32px" />
            </q-avatar>
            <div class="text-h6 text-primary q-mt-sm">Atualização de Dados</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="showConfirmDialog" class="q-gutter-md">
              <!-- Nome / Sobrenome -->
              <div class="form-row">
                <q-input
                  v-model="form.nome"
                  label="Nome *"
                  outlined
                  class="form-input"
                  :rules="[(val) => !!val || 'Nome é obrigatório']"
                />
                <q-input
                  v-model="form.sobrenome"
                  label="Sobrenome *"
                  outlined
                  class="form-input"
                  :rules="[(val) => !!val || 'Sobrenome é obrigatório']"
                />
              </div>

              <!-- Tipo de Pessoa -->
              <div class="form-row">
                <q-select
                  v-model="form.tipoPessoa"
                  :options="tiposPessoa"
                  label="Tipo de Pessoa *"
                  outlined
                  class="form-input-full"
                  emit-value
                  map-options
                  @update:model-value="onTipoPessoaChange"
                  :rules="[(val) => !!val || 'Selecione o tipo de pessoa']"
                />
              </div>

              <!-- Campos PJ -->
              <div v-if="form.tipoPessoa === 'juridica'" class="form-row">
                <q-input
                  v-model="form.nomeFantasia"
                  label="Nome Fantasia *"
                  outlined
                  class="form-input"
                />
                <q-input
                  v-model="form.razaoSocial"
                  label="Razão Social *"
                  outlined
                  class="form-input"
                />
              </div>

              <!-- Documento -->
              <div class="form-row">
                <q-input
                  v-model="form.documento"
                  :label="form.tipoPessoa === 'juridica' ? 'CNPJ *' : 'CPF *'"
                  outlined
                  class="form-input-full"
                  :mask="form.tipoPessoa === 'juridica' ? '##.###.###/####-##' : '###.###.###-##'"
                  :rules="documentoRules"
                  unmasked-value
                />
              </div>

              <!-- Data de Nascimento (apenas PF) -->
              <div v-if="form.tipoPessoa === 'fisica'" class="form-row">
                <q-input
                  v-model="form.dataNascimento"
                  type="date"
                  label="Data de Nascimento *"
                  outlined
                  class="form-input-full"
                />
              </div>

              <!-- Email (disabled) + Celular -->
              <div class="form-row">
                <q-input
                  v-model="form.email"
                  label="Email"
                  type="email"
                  outlined
                  disable
                  class="form-input"
                />
                <q-input
                  v-model="form.celular"
                  label="Celular *"
                  outlined
                  mask="(##) #####-####"
                  unmasked-value
                  class="form-input"
                  :rules="[(val) => !!val || 'Celular é obrigatório']"
                />
              </div>

              <!-- Botão Atualizar -->
              <div class="flex flex-center q-mt-lg" style="margin-top: 180px">
                <q-btn
                  type="submit"
                  label="Atualizar Dados"
                  color="primary"
                  size="xl"
                  class="q-px-xl submit-btn"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card de Endereço -->
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

            <!-- Loading -->
            <div v-if="loadingAddressList" class="text-center q-py-xl">
              <q-spinner color="secondary" size="50px" />
              <div class="text-grey-7 q-mt-md">Carregando endereços...</div>
            </div>

            <!-- Lista vazia -->
            <div v-else-if="addressList.length === 0" class="text-center q-py-xl">
              <q-icon name="mdi-map-marker-off" size="64px" color="grey-5" />
              <div class="text-h6 text-grey-7 q-mt-md">Nenhum endereço cadastrado</div>
              <div class="text-body2 text-grey-6 q-mt-sm">
                Clique no botão acima para adicionar seu primeiro endereço
              </div>
            </div>

            <!-- Lista de endereços -->
            <div v-else class="address-list">
              <q-card
                v-for="address in addressList"
                :key="address.id"
                class="address-item q-mb-md"
                bordered
                flat
              >
                <q-card-section class="row items-center">
                  <div class="col cursor-pointer" @click="editAddress(address)">
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
                      @click="showDeleteDialog(address)"
                    >
                      <q-tooltip>Excluir endereço</q-tooltip>
                    </q-btn>
                    <q-icon name="mdi-chevron-right" color="grey-5" size="24px" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>

          <!-- Formulário de Endereço -->
          <q-card-section v-else>
            <div class="q-mb-xl">
              <q-btn
                outline
                color="secondary"
                label="Voltar"
                icon="mdi-arrow-left"
                @click="backToAddressList"
              />
            </div>

            <q-form @submit.prevent="showAddressConfirmDialog" class="q-gutter-md">
              <!-- CEP -->
              <div class="form-row">
                <q-input
                  v-model="addressForm.cep"
                  label="CEP *"
                  outlined
                  mask="#####-###"
                  unmasked-value
                  class="form-input-full"
                  :rules="cepRules"
                  @blur="buscarCep"
                  :loading="loadingCep"
                />
              </div>

              <!-- Logradouro -->
              <div class="form-row">
                <q-input
                  v-model="addressForm.logradouro"
                  label="Logradouro *"
                  outlined
                  class="form-input-full"
                  :rules="[(val) => !!val || 'Logradouro é obrigatório']"
                />
              </div>

              <!-- Número e Complemento -->
              <div class="form-row">
                <q-input
                  v-model="addressForm.numero"
                  label="Número *"
                  outlined
                  class="form-input form-input-number"
                  :rules="[(val) => !!val || 'Número é obrigatório']"
                />
                <q-input
                  v-model="addressForm.complemento"
                  label="Complemento"
                  outlined
                  class="form-input form-input-complement"
                />
              </div>

              <!-- Bairro -->
              <div class="form-row">
                <q-input
                  v-model="addressForm.bairro"
                  label="Bairro *"
                  outlined
                  class="form-input-full"
                  :rules="[(val) => !!val || 'Bairro é obrigatório']"
                />
              </div>

              <!-- Cidade e Estado -->
              <div class="form-row">
                <q-input
                  v-model="addressForm.cidade"
                  label="Cidade *"
                  outlined
                  class="form-input form-input-city"
                  :rules="[(val) => !!val || 'Cidade é obrigatória']"
                />
                <q-select
                  v-model="addressForm.estado"
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
                  v-model="addressForm.enderecoPadrao"
                  label="Tornar este meu endereço padrão"
                  class="form-input-full"
                />
              </div>

              <!-- Botão Adicionar/Atualizar Endereço -->
              <div class="flex flex-center q-mt-lg">
                <q-btn
                  type="submit"
                  :label="editingAddress ? 'Atualizar Endereço' : 'Adicionar Endereço'"
                  color="secondary"
                  size="xl"
                  class="q-px-xl submit-btn q-mt-sm"
                  :loading="loadingAddress"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog de Confirmação -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section class="text-center">
          <q-avatar size="64px" color="primary" text-color="white" class="q-mb-md">
            <q-icon name="mdi-account-check" size="32px" />
          </q-avatar>
          <div class="text-h6 text-weight-medium">Confirmar Atualização</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center">
          <p class="text-body1 q-mb-sm">Tem certeza de que deseja atualizar seus dados pessoais?</p>
          <p class="text-body2 text-grey-7">As informações do seu perfil serão alteradas.</p>
        </q-card-section>

        <q-card-actions align="center" class="q-pt-none">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            class="q-px-lg"
            @click="confirmDialog = false"
            :disable="loading"
          />
          <q-btn
            label="Atualizar"
            color="primary"
            class="q-px-lg"
            @click="onSubmit"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Confirmação do Endereço -->
    <q-dialog v-model="addressConfirmDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section class="text-center">
          <q-avatar size="64px" color="secondary" text-color="white" class="q-mb-md">
            <q-icon name="mdi-map-marker-check" size="32px" />
          </q-avatar>
          <div class="text-h6 text-weight-medium">
            Confirmar {{ editingAddress ? 'atualização' : 'novo endereço' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center">
          <p class="text-body1 q-mb-sm">
            Tem certeza de que deseja {{ editingAddress ? 'atualizar' : 'adicionar' }} este
            endereço?
          </p>
          <p class="text-body2 text-grey-7">
            {{
              editingAddress
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
            @click="addressConfirmDialog = false"
            :disable="loadingAddress"
          />
          <q-btn
            :label="editingAddress ? 'Atualizar' : 'Adicionar'"
            color="secondary"
            class="q-px-lg"
            @click="onSubmitAddress"
            :loading="loadingAddress"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Confirmação de Exclusão -->
    <q-dialog v-model="deleteDialog" persistent>
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
            v-if="addressToDelete"
            class="text-body2 text-grey-7 q-mt-md q-pa-sm bg-grey-2 rounded-borders"
          >
            <div class="text-weight-medium">
              {{ addressToDelete.logradouro }}, {{ addressToDelete.numero }}
            </div>
            <div>
              {{ addressToDelete.bairro }}, {{ addressToDelete.cidade }} -
              {{ addressToDelete.estado }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pt-none">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            class="q-px-lg"
            @click="cancelDelete"
            :disable="loadingDelete"
          />
          <q-btn
            label="Excluir"
            color="negative"
            class="q-px-lg"
            @click="confirmDelete"
            :loading="loadingDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import useUserProfile from 'src/composables/UseUserProfile'
import useAdressUser from 'src/composables/useAdressUser'
import { validarUpdateUsuario } from 'src/utils/validations/validarUpdateUsuario.js'
import { validarEndereco } from 'src/utils/validations/validarEndereco.js'

const { user, updatePessoaFisico, updatePessoaJuridica } = useAuthUser()
const { profile, fetchProfile } = useUserProfile()
const { addAdress, getAdress, updateAdress, deleteAdress } = useAdressUser()

const loading = ref(false)
const loadingAddress = ref(false)
const loadingCep = ref(false)
const loadingDelete = ref(false)
const loadingProfile = ref(true)
const confirmDialog = ref(false)
const addressConfirmDialog = ref(false)
const deleteDialog = ref(false)
const showAddressForm = ref(false)
const addressList = ref([])
const loadingAddressList = ref(false)
const editingAddress = ref(null)
const addressToDelete = ref(null)

// Formulário de dados pessoais
const form = reactive({
  nome: '',
  sobrenome: '',
  tipoPessoa: '',
  nomeFantasia: '',
  razaoSocial: '',
  inscricaoEstadual: '',
  documento: '',
  email: '',
  celular: '',
  dataNascimento: '',
})

// Formulário de endereço
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

const tiposPessoa = [
  { label: 'Pessoa Física', value: 'fisica' },
  { label: 'Pessoa Jurídica', value: 'juridica' },
]

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

const documentoRules = [
  (val) => !!val || (form.tipoPessoa === 'juridica' ? 'CNPJ é obrigatório' : 'CPF é obrigatório'),
  (val) => {
    if (form.tipoPessoa === 'juridica') {
      return val.replace(/\D/g, '').length === 14 || 'CNPJ deve ter 14 dígitos'
    } else {
      return val.replace(/\D/g, '').length === 11 || 'CPF deve ter 11 dígitos'
    }
  },
]

const cepRules = [
  (val) => !!val || 'CEP é obrigatório',
  (val) => val.replace(/\D/g, '').length === 8 || 'CEP deve ter 8 dígitos',
]

const onTipoPessoaChange = () => {
  form.documento = ''
  form.nomeFantasia = ''
  form.razaoSocial = ''
  form.inscricaoEstadual = ''
  form.dataNascimento = ''
}

// Carregar perfil e endereços ao montar o componente
// Carregar perfil e endereços ao montar o componente
onMounted(async () => {
  loadingProfile.value = true
  try {
    console.log('🚀 Iniciando carregamento do perfil...')
    console.log('👤 User atual:', user.value)

    // Buscar perfil do usuário
    await fetchProfile()

    console.log('📦 Perfil carregado:', profile.value)

    if (profile.value) {
      // Preencher formulário com dados do perfil
      form.nome = profile.value.nome || ''
      form.sobrenome = profile.value.sobrenome || ''
      form.tipoPessoa = profile.value.tipo_cliente === 'pessoa_fisica' ? 'fisica' : 'juridica'
      form.documento = profile.value.cpf || profile.value.cnpj || ''
      form.dataNascimento = profile.value.data_nascimento || ''
      form.razaoSocial = profile.value.razao_social || ''
      form.inscricaoEstadual = profile.value.inscricao_estadual || ''
      form.celular = profile.value.celular || ''
      form.email = user.value?.email || ''

      console.log('✅ Formulário preenchido:')
      console.log('  - Nome:', form.nome)
      console.log('  - Sobrenome:', form.sobrenome)
      console.log('  - TipoPessoa:', form.tipoPessoa)
      console.log('  - Documento:', form.documento)
      console.log('  - Celular:', form.celular)
      console.log('  - Email:', form.email)
    } else {
      console.warn('⚠️ Perfil não encontrado!')
    }

    // Carregar endereços
    await loadAddresses()
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error)
    negativeNotify('Erro ao carregar dados do perfil')
  } finally {
    loadingProfile.value = false
    console.log('🏁 Carregamento finalizado')
  }
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
        addressForm.logradouro = data.logradouro || ''
        addressForm.bairro = data.bairro || ''
        addressForm.cidade = data.localidade || ''
        addressForm.estado = data.uf || ''
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

const showConfirmDialog = () => {
  confirmDialog.value = true
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

const onSubmit = async () => {
  const { isValid, message, form: formValidado } = await validarUpdateUsuario(form)
  if (!isValid) {
    negativeNotify(message)
    return
  }
  loading.value = true
  try {
    if (form.tipoPessoa === 'fisica') {
      await updatePessoaFisico({
        primeiro_nome: formValidado.nome,
        sobrenome: formValidado.sobrenome,
        tipo_pessoa: formValidado.tipoPessoa,
        documento: formValidado.documento,
        data_nascimento: formValidado.dataNascimento,
        celular: formValidado.celular,
      })
    } else {
      await updatePessoaJuridica({
        primeiro_nome: formValidado.nome,
        sobrenome: formValidado.sobrenome,
        tipo_pessoa: formValidado.tipoPessoa,
        razao_social: formValidado.razaoSocial,
        inscricao_estadual: formValidado.inscricaoEstadual,
        documento: formValidado.documento,
        celular: formValidado.celular,
      })
    }
    positiveNotify('Dados atualizados com sucesso!')
    confirmDialog.value = false

    // Recarregar perfil atualizado
    await fetchProfile()
  } catch (error) {
    negativeNotify(error.message)
    confirmDialog.value = false
  }
  loading.value = false
}

const onSubmitAddress = async () => {
  const {
    isValid,
    form: addressFormValidado,
    message,
  } = await validarEndereco(addressForm, estados)

  if (!isValid) {
    negativeNotify(message)
    return
  }

  loadingAddress.value = true
  try {
    const addressData = {
      cep: addressFormValidado.cep,
      logradouro: addressFormValidado.logradouro,
      numero: addressFormValidado.numero,
      complemento: addressFormValidado.complemento,
      bairro: addressFormValidado.bairro,
      cidade: addressFormValidado.cidade,
      estado: addressFormValidado.estado,
      endereco_padrao: addressFormValidado.enderecoPadrao,
    }

    if (editingAddress.value) {
      // Atualizar endereço existente
      await updateAdress(editingAddress.value.id, addressData)
      positiveNotify('Endereço atualizado com sucesso!')
    } else {
      // Adicionar novo endereço
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

// Container principal com responsividade
.form-container
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 1rem
  width: 100%
  max-width: 1200px
  margin: 0 auto

// Cards dos formulários
.form-card
  display: flex
  justify-content: center

.update-card
  width: 100%
  max-width: 600px
  height: fit-content

// Linhas dos formulários
.form-row
  display: flex
  gap: 0.5rem
  width: 100%

// Inputs dos formulários
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

// Espaçamento
.form-spacer
  height: 180px

// Botão de submit
.submit-btn
  min-width: 200px

// Estilos para lista de endereços
.address-list
  max-height: 500px
  overflow-y: auto

.address-item
  transition: all 0.3s ease

// Breakpoints responsivos
@media (max-width: 1023px)
  .form-container
    grid-template-columns: 1fr
    gap: 1.5rem
    padding: 0 1rem
    justify-items: center

  .form-card
    width: 100%
    max-width: 600px

  .update-card
    width: 100%

@media (max-width: 768px)
  .form-container
    padding: 0 0.5rem

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

  .update-card
    min-height: auto

  .submit-btn
    width: 100%
    max-width: 300px

@media (max-width: 480px)
  .form-container
    padding: 0 0.25rem

  .submit-btn
    min-width: auto
    width: 100%
</style>
