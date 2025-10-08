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
        <PersonalDataForm :initial-data="formData" @submit="handleSubmit" :loading="loading" />
      </q-card-section>
    </q-card>

    <!-- Dialog de Confirmação -->
    <ConfirmDialog
      v-model="confirmDialog"
      title="Confirmar Atualização"
      message="Tem certeza de que deseja atualizar seus dados pessoais?"
      description="As informações do seu perfil serão alteradas."
      icon="mdi-account-check"
      color="primary"
      :loading="loading"
      @confirm="onSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PersonalDataForm from 'src/components/forms/profile/PersonalDataForm.vue'
import ConfirmDialog from 'src/components/dialogs/ConfirmDialog.vue'
import useAuthUser from 'src/composables/UseAuthUser'
import { negativeNotify } from 'src/composables/UseNotify'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-success'])

const { updatePessoaFisico, updatePessoaJuridica } = useAuthUser()

const loading = ref(false)
const confirmDialog = ref(false)
const pendingFormData = ref(null)

const formData = computed(() => ({
  nome: props.user?.user_metadata.primeiro_nome || '',
  sobrenome: props.user?.user_metadata.sobrenome || '',
  tipoPessoa: props.user?.user_metadata.tipo_pessoa || '',
  nomeFantasia: props.user?.user_metadata.nome_fantasia || '',
  razaoSocial: props.user?.user_metadata.razao_social || '',
  documento: props.user?.user_metadata.documento || '',
  email: props.user?.email || 'usuario@email.com',
  celular: props.user?.user_metadata.celular || '',
  dataNascimento: props.user?.user_metadata.data_nascimento || '',
}))

const handleSubmit = (formData) => {
  pendingFormData.value = formData
  confirmDialog.value = true
}

const onSubmit = async () => {
  if (!pendingFormData.value) return

  loading.value = true
  try {
    const data = pendingFormData.value

    if (data.tipoPessoa === 'fisica') {
      await updatePessoaFisico({
        primeiro_nome: data.nome,
        sobrenome: data.sobrenome,
        tipo_pessoa: data.tipoPessoa,
        documento: data.documento,
        data_nascimento: data.dataNascimento,
        celular: data.celular,
      })
    } else {
      await updatePessoaJuridica({
        primeiro_nome: data.nome,
        sobrenome: data.sobrenome,
        tipo_pessoa: data.tipoPessoa,
        nome_fantasia: data.nomeFantasia,
        razao_social: data.razaoSocial,
        documento: data.documento,
        celular: data.celular,
        data_nascimento: null,
      })
    }

    confirmDialog.value = false
    emit('update-success')
  } catch (error) {
    negativeNotify(error.message)
    confirmDialog.value = false
  } finally {
    loading.value = false
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

@media (max-width: 1023px)
  .form-card
    width: 100%
    max-width: 600px

  .update-card
    width: 100%
</style>
