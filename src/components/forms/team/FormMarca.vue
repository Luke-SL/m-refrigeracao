<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Cadastrar Marca</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="confirmSave" class="q-gutter-md">
        <q-input
          v-model="marca.nome"
          label="Nome *"
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />
        <div class="row justify-end q-gutter-sm">
          <q-btn label="Limpar" color="grey" @click="reset" />
          <q-btn label="Salvar" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>

    <!-- Dialog de Confirmação -->
    <q-dialog v-model="confirmDialog">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section class="text-center">
          <q-avatar size="64px" color="secondary" text-color="white" class="q-mb-md">
            <q-icon name="business" size="32px" />
          </q-avatar>
          <div class="text-h6 text-weight-medium">Confirmar Cadastro</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center">
          <p class="text-body1 q-mb-sm">
            Tem certeza que deseja cadastrar a marca "{{ marca.nome }}"?
          </p>
          <p class="text-body2 text-grey-7">Esta ação irá adicionar uma nova marca ao sistema.</p>
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
            label="Confirmar"
            color="primary"
            class="q-px-lg"
            @click="save"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref } from 'vue'
import useApi from 'src/composables/useApi'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'
import { validarMarcaCategoria } from 'src/utils/validations/validorMarcaCategoria.js'

export default {
  name: 'FormMarca',
  emits: ['success'],
  setup(props, { emit }) {
    const { addMarca } = useApi()
    const loading = ref(false)
    const confirmDialog = ref(false)

    const marca = ref({
      nome: '',
    })

    const confirmSave = () => {
      confirmDialog.value = true
    }

    const save = async () => {
      loading.value = true
      try {
        const validacao = await validarMarcaCategoria(marca.value)

        if (!validacao.isValid) {
          loading.value = false
          throw negativeNotify(validacao.message)
        }
        // positiveNotify('Validando...')
        await addMarca(validacao.form)
        positiveNotify(`Marca ${validacao.form.nome} cadastrada com sucesso!`)
        reset()
        confirmDialog.value = false
        emit('success')
      } catch (error) {
        negativeNotify(error.message || 'Erro ao cadastrar marca.')
      }
      loading.value = false
    }

    const reset = () => {
      marca.value = { nome: '' }
    }

    return {
      marca,
      loading,
      confirmDialog,
      confirmSave,
      save,
      reset,
    }
  },
}
</script>
