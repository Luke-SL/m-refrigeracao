<template>
  <q-card class="q-pa-md card-style">
    <q-card-section>
      <div class="text-h6">Cadastrar Produto</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="handleSave" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="produto.categoria"
              :options="categorias"
              label="Categoria *"
              outlined
              option-label="nome"
              option-value="id"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="produto.marca"
              :options="marcas"
              label="Marca *"
              outlined
              option-label="nome"
              option-value="id"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
        </div>

        <q-input
          v-model="produto.nome"
          label="Nome *"
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório']"
        />

        <q-input v-model="produto.descricao" label="Descrição" outlined type="textarea" rows="3" />

        <div>
          <div class="text-subtitle2 q-mb-sm">Imagens (até 6) - a primeira será a thumbnail</div>
          <q-file
            v-model="produto.imagens"
            label="Selecionar imagens"
            outlined
            multiple
            accept="image/*"
            max-files="6"
            counter
            :rules="[(val) => !val || val.length <= 6 || 'Máximo 6 imagens']"
            @update:model-value="handleImageChange"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <!-- Pré-visualização das imagens -->
          <div v-if="imagePreviews.length > 0" class="q-mt-md">
            <div class="text-subtitle2 q-mb-sm">
              Pré-visualização ({{ imagePreviews.length }} imagem{{
                imagePreviews.length > 1 ? 'ns' : ''
              }}):
            </div>
            <div class="row q-col-gutter-sm">
              <div
                v-for="(preview, index) in imagePreviews"
                :key="index"
                class="col-6 col-sm-4 col-md-3 col-lg-2"
              >
                <q-card flat bordered class="image-preview-card q-mb-md">
                  <div class="image-container">
                    <q-img :src="preview.url" :ratio="1" class="rounded-borders" fit="cover" />
                    <div class="delete-overlay">
                      <q-btn
                        round
                        size="sm"
                        icon="close"
                        color="white"
                        text-color="negative"
                        @click="removeImagem(index)"
                        class="delete-btn"
                      />
                    </div>
                  </div>
                  <q-card-section class="q-pa-xs">
                    <div class="text-caption text-center ellipsis" :title="preview.name">
                      {{ preview.name }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn label="Limpar" color="grey" @click="reset" />
          <q-btn label="Salvar" type="submit" color="primary" :loading="loading" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref } from 'vue'
import useApi from 'src/composables/useApi'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'

export default {
  name: 'FormProduto',
  props: {
    marcas: {
      type: Array,
      default: () => [],
    },
    categorias: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['success'],
  setup(props, { emit }) {
    const { addProduto, uploadProductImages } = useApi()
    const loading = ref(false)
    const imagePreviews = ref([])

    const produto = ref({
      categoria: null,
      marca: null,
      nome: '',
      descricao: '',
      imagens: [],
    })

    const handleImageChange = (files) => {
      if (!files || files.length === 0) return

      const fileArray = Array.isArray(files) ? files : Array.from(files)

      fileArray.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreviews.value.push({
            url: e.target.result,
            name: file.name,
          })
        }
        reader.readAsDataURL(file)
      })
    }

    const clearImagePreviews = () => {
      imagePreviews.value.forEach((preview) => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url)
        }
      })
      imagePreviews.value = []
    }

    const removeImagem = (index) => {
      if (imagePreviews.value[index]?.url.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews.value[index].url)
      }
      imagePreviews.value.splice(index, 1)

      if (produto.value.imagens && produto.value.imagens.length > 0) {
        const newImages = Array.from(produto.value.imagens)
        newImages.splice(index, 1)
        produto.value.imagens = newImages.length > 0 ? newImages : null
      }
    }

    const handleSave = async () => {
      try {
        loading.value = true

        let pathImagens = null
        if (produto.value.imagens && produto.value.imagens.length > 0) {
          const { directoryId, errors } = await uploadProductImages(produto.value.imagens)

          if (errors.length > 0) {
            negativeNotify('Uma ou mais imagens falharam no upload.')
            loading.value = false
            return
          }

          pathImagens = directoryId
        }

        const novoProduto = {
          nome: produto.value.nome,
          descricao: produto.value.descricao,
          categoria_id: produto.value.categoria?.id || produto.value.categoria,
          marca_id: produto.value.marca?.id || produto.value.marca,
          path_imagens: pathImagens,
        }

        const { error } = await addProduto(novoProduto)

        if (error) {
          throw new Error(error.message)
        }

        positiveNotify(`Produto "${produto.value.nome}" cadastrado com sucesso!`)
        reset()
        emit('success')
      } catch (err) {
        negativeNotify(`Erro ao cadastrar produto: ${err.message}`)
      } finally {
        loading.value = false
      }
    }

    const reset = () => {
      produto.value = {
        categoria: null,
        marca: null,
        nome: '',
        descricao: '',
        imagens: null,
      }
      clearImagePreviews()
    }

    return {
      produto,
      loading,
      imagePreviews,
      handleImageChange,
      handleSave,
      removeImagem,
      reset,
    }
  },
}
</script>

<style scoped>
.image-preview-card {
  position: relative;
  transition: transform 0.2s;
}

.image-preview-card:hover {
  transform: scale(1.02);
}

.image-container {
  position: relative;
}

.delete-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-preview-card:hover .delete-overlay {
  opacity: 1;
}

.delete-btn {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
