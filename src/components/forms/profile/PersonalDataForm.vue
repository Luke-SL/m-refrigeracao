<template>
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
        <q-form @submit.prevent="showConfirmDialog" class="q-gutter-md" ref="formRef">
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
              :rules="[(val) => !!val || 'Nome Fantasia é obrigatório']"
            />
            <q-input
              v-model="form.razaoSocial"
              label="Razão Social *"
              outlined
              class="form-input"
              :rules="[(val) => !!val || 'Razão Social é obrigatória']"
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
              :rules="[(val) => !!val || 'Data de nascimento é obrigatória']"
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
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Dialog de Confirmação -->
    <ConfirmUpdateDialog v-model="confirmDialog" :loading="loading" @confirm="onSubmit" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import useUserProfile from 'src/composables/UseUserProfile'
import ConfirmUpdateDialog from './ConfirmUpdateDialog.vue'

const { user, updatePessoaFisico, updatePessoaJuridica } = useAuthUser()
const { profile, telefonePrincipal, fetchProfile } = useUserProfile()

const loading = ref(false)
const confirmDialog = ref(false)
const formRef = ref(null)

const form = reactive({
  nome: '',
  sobrenome: '',
  tipoPessoa: '',
  nomeFantasia: '',
  razaoSocial: '',
  documento: '',
  email: '',
  celular: '',
  dataNascimento: '',
})

const tiposPessoa = [
  { label: 'Pessoa Física', value: 'fisica' },
  { label: 'Pessoa Jurídica', value: 'juridica' },
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

const onTipoPessoaChange = () => {
  form.documento = ''
  form.nomeFantasia = ''
  form.razaoSocial = ''
  form.dataNascimento = ''
}

// Carregar dados ao montar o componente
onMounted(async () => {
  try {
    await fetchProfile()

    if (profile.value) {
      form.nome = profile.value.nome || ''
      form.sobrenome = profile.value.sobrenome || ''
      form.tipoPessoa = profile.value.tipo_cliente === 'pessoa_fisica' ? 'fisica' : 'juridica'
      form.documento = profile.value.cpf || profile.value.cnpj || ''
      form.dataNascimento = profile.value.data_nascimento || ''
      form.razaoSocial = profile.value.razao_social || ''
      form.email = user.value?.email || ''
    }

    // Buscar telefone principal
    if (telefonePrincipal.value) {
      form.celular = `${telefonePrincipal.value.ddd}${telefonePrincipal.value.numero}`
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    negativeNotify('Erro ao carregar dados do perfil')
  }
})

const showConfirmDialog = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    confirmDialog.value = true
  }
}

const onSubmit = async () => {
  loading.value = true
  console.log('Submitting form with data:', form)
  try {
    if (form.tipoPessoa === 'fisica') {
      await updatePessoaFisico({
        primeiro_nome: form.nome,
        sobrenome: form.sobrenome,
        tipo_pessoa: form.tipoPessoa,
        documento: form.documento,
        data_nascimento: form.dataNascimento,
        celular: form.celular,
      })
    } else {
      await updatePessoaJuridica({
        primeiro_nome: form.nome,
        sobrenome: form.sobrenome,
        tipo_pessoa: form.tipoPessoa,
        razao_social: form.razaoSocial,
        documento: form.documento,
        celular: form.celular,
        data_nascimento: null,
      })
    }
    positiveNotify('Dados atualizados com sucesso!')
    confirmDialog.value = false

    // Recarregar perfil atualizado
    await fetchProfile()
  } catch (error) {
    console.error('Erro ao atualizar dados:', error)
    negativeNotify(error.message || 'Erro ao atualizar dados')
  } finally {
    loading.value = false
    confirmDialog.value = false
  }
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

.form-row
  display: flex
  gap: 0.5rem
  width: 100%

.form-input
  flex: 1

.form-input-full
  width: 100%

.submit-btn
  min-width: 200px

@media (max-width: 1023px)
  .form-card
    width: 100%
    max-width: 600px

  .update-card
    width: 100%

@media (max-width: 768px)
  .form-row
    flex-direction: column
    gap: 1rem

  .form-input,
  .form-input-full
    width: 100%
    flex: none

  .update-card
    min-height: auto

  .submit-btn
    width: 100%
    max-width: 300px

@media (max-width: 480px)
  .submit-btn
    min-width: auto
    width: 100%
</style>
