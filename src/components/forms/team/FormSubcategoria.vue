<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Cadastrar Subcategoria</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="confirmSave" class="q-gutter-md">
        <q-select
          v-model="subcategoria.categoria"
          :options="categorias"
          label="Categoria *"
          outlined
          option-label="nome"
          option-value="id"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />
        <q-input
          v-model="subcategoria.nome"
          label="Nome da subcategoria *"
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
          <q-avatar size="64px" color="accent" text-color="white" class="q-mb-md">
            <q-icon name="category" size="32px" />
          </q-avatar>
          <div class="text-h6 text-weight-medium">Confirmar Cadastro</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center">
          <p class="text-body1 q-mb-sm">
            Tem certeza que deseja cadastrar a subcategoria "{{ subcategoria.nome }}" para a
            categoria "{{ subcategoria.categoria.nome }}"?
          </p>
          <p class="text-body2 text-grey-7">
            Esta ação irá adicionar uma nova subcategoria ao sistema.
          </p>
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
  name: 'FormSubcategoria',
  props: {
    categorias: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['success'],
  setup(props, { emit }) {
    const { addSubcategoria } = useApi()
    const loading = ref(false)
    const confirmDialog = ref(false)

    const subcategoria = ref({
      categoria: null,
      nome: '',
    })

    const confirmSave = () => {
      confirmDialog.value = true
    }

    const save = async () => {
      loading.value = true

      try {
        const validacao = await validarMarcaCategoria(subcategoria.value)

        if (!validacao.isValid) {
          loading.value = false
          throw negativeNotify(validacao.message)
        }

        await addSubcategoria(subcategoria.value)
        positiveNotify(
          `Subcategoria ${subcategoria.value.nome} cadastrada para a categoria ${subcategoria.value.categoria.nome} com sucesso!`,
        )
        reset()
        confirmDialog.value = false
        emit('success')
      } catch (error) {
        negativeNotify(error.message || 'Erro ao cadastrar categoria.')
      } finally {
        loading.value = false
      }

      /*try {
        const validacao = await validarMarcaCategoria(subcategoria.value)

        if (!validacao.isValid) {
          loading.value = false
          throw negativeNotify(validacao.message)
        }

        await addSubcategoria(validacao.form)
        positiveNotify(
          `Subcategoria ${validacao.form.nome} cadastrada para a categoria ${subcategoria.value.categoria.nome} com sucesso!`,
        )
        reset()
        confirmDialog.value = false
        emit('success')
      } catch (error) {
        negativeNotify(error.message || 'Erro ao cadastrar categoria.')
      }
      loading.value = false*/
      // positiveNotify('Funcionalidade desativada temporariamente.')
    }

    const reset = () => {
      subcategoria.value = { nome: '' }
    }

    return {
      subcategoria,
      loading,
      confirmDialog,
      confirmSave,
      save,
      reset,
    }
  },
}
</script>
