<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md">
    <q-card class="q-pa-lg shadow-2 rounded-borders register-card">
      <!-- Ícone no topo -->
      <q-card-section class="text-center">
        <q-avatar size="64px" color="primary" text-color="white">
          <q-icon name="mdi-account-plus" size="32px" />
        </q-avatar>
        <div class="text-h6 text-primary q-mt-sm">Registro de Usuário</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <!-- Nome / Sobrenome -->
          <div class="row q-gutter-sm" :class="$q.screen.lt.md ? 'col-12' : ''">
            <q-input
              v-model="form.nome"
              label="Nome *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            />
            <q-input
              v-model="form.sobrenome"
              label="Sobrenome *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="[(val) => !!val || 'Sobrenome é obrigatório']"
            />
          </div>

          <!-- Tipo de Pessoa -->
          <div class="row q-gutter-sm">
            <q-select
              v-model="form.tipoPessoa"
              :options="tiposPessoa"
              label="Tipo de Pessoa *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              emit-value
              map-options
              @update:model-value="onTipoPessoaChange"
              :rules="[(val) => !!val || 'Selecione o tipo de pessoa']"
            />
          </div>

          <!-- Campos PJ -->
          <div v-if="form.tipoPessoa === 'juridica'" class="row q-gutter-sm">
            <q-input
              v-model="form.nomeFantasia"
              label="Nome Fantasia *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="[(val) => !!val || 'Nome fantasia é obrigatório']"
            />
            <q-input
              v-model="form.razaoSocial"
              label="Razão Social *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="[(val) => !!val || 'Razão social é obrigatória']"
            />
          </div>

          <!-- Documento -->
          <div class="row q-gutter-sm">
            <q-input
              v-model="form.documento"
              :label="form.tipoPessoa === 'juridica' ? 'CNPJ *' : 'CPF *'"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :mask="form.tipoPessoa === 'juridica' ? '##.###.###/####-##' : '###.###.###-##'"
              :rules="documentoRules"
              unmasked-value
            />
          </div>

          <!-- Campo Data de Nascimento usando input nativo -->
          <div v-if="form.tipoPessoa === 'fisica' || !form.tipoPessoa" class="row q-gutter-sm">
            <q-input
              v-model="form.dataNascimento"
              type="date"
              label="Data de Nascimento *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="[(val) => !!val || 'Data de nascimento é obrigatória']"
            />
          </div>

          <!-- Email + Celular -->
          <div class="row q-gutter-sm">
            <q-input
              v-model="form.email"
              label="Email *"
              type="email"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="emailRules"
            />

            <q-input
              v-model="form.celular"
              label="Celular *"
              outlined
              mask="(##) #####-####"
              unmasked-value
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="[(val) => !!val || 'Celular é obrigatório']"
            />
          </div>

          <!-- Senha / Confirmação -->
          <div class="row q-gutter-sm" :class="$q.screen.lt.md ? 'col-12' : ''">
            <q-input
              v-model="form.senha"
              :type="showPassword ? 'text' : 'password'"
              label="Senha *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="senhaRules"
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-input
              v-model="form.confirmacaoSenha"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirmar Senha *"
              outlined
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :rules="confirmacaoSenhaRules"
            >
              <template v-slot:append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </q-input>
          </div>

          <!-- Container para centralizar o botão -->
          <div class="flex flex-center q-mt-lg">
            <q-btn
              type="submit"
              label="Registrar"
              color="primary"
              size="xl"
              class="q-px-xl"
              :loading="loading"
              style="min-width: 200px"
            />
          </div>

          <!-- Voltar para login -->
          <div class="text-center q-mt-md">
            <q-btn flat dense no-caps color="primary" to="/login" label="Voltar para Login" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import UseAuthUser from 'src/composables/UseAuthUser.js'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const router = useRouter()

const { registerPessoaFisica, registerPessoaJuridica } = UseAuthUser()

const form = reactive({
  nome: '',
  sobrenome: '',
  tipoPessoa: 'fisica',
  nomeFantasia: '',
  razaoSocial: '',
  documento: '',
  email: '',
  celular: '',
  dataNascimento: '', // novo campo
  senha: '',
  confirmacaoSenha: '',
  role: 'cliente',
})

const tiposPessoa = [
  { label: 'Pessoa Física', value: 'fisica' },
  { label: 'Pessoa Jurídica', value: 'juridica' },
]

const emailRules = [
  (val) => !!val || 'Email é obrigatório',
  (val) => /.+@.+\..+/.test(val) || 'Email deve ser válido',
]
const senhaRules = [
  (val) => !!val || 'Senha é obrigatória',
  (val) => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
]
const confirmacaoSenhaRules = [
  (val) => !!val || 'Confirmação de senha é obrigatória',
  (val) => val === form.senha || 'Senhas não conferem',
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
}

const onSubmit = async () => {
  loading.value = true
  // console.log(form)
  try {
    if (form.tipoPessoa === 'fisica') {
      await registerPessoaFisica(form)
    } else {
      await registerPessoaJuridica(form)
    }
    positiveNotify('Cadastro realizado com sucesso!')
    router.push({
      name: 'email-confirmation',
      query: { email: form.email },
    })
    loading.value = false
  } catch (error) {
    negativeNotify(error.message)
  }
  loading.value = false
}
</script>

<style lang="sass" scoped>
.rounded-borders
  border-radius: 16px

.register-card
  width: 600px
  max-width: 95vw
</style>
