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
              @update:model-value="onCategoriaChange"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="produto.subcategoria"
              :options="
                subcategorias.filter(
                  (subcat) => subcat.categoria_id === (produto.categoria?.id || produto.categoria),
                )
              "
              label="Subcategoria"
              outlined
              option-label="nome"
              option-value="id"
              @update:model-value="onSubcategoriaChange"
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

        <!-- Toggle manual para tipo de produto (fallback) -->
        <div class="q-mt-md q-mb-sm">
          <q-toggle
            v-model="isArCondicionado"
            label="Este produto é um ar-condicionado?"
            color="primary"
            @update:model-value="onTipoChange"
          />
          <div v-if="autoDetectadoAr" class="text-caption text-grey-7 q-mt-xs">
            <q-icon name="info" size="xs" /> Detectado automaticamente pela categoria
          </div>
        </div>

        <!-- Dimensões e Peso para Ventilador -->
        <div v-if="!isArCondicionado">
          <div class="text-h6 q-mt-md q-mb-sm">Dimensões e Peso</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="produto.peso_liquido_kg"
                label="Peso Líquido (kg) *"
                outlined
                @update:model-value="(val) => (produto.peso_liquido_kg = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="produto.peso_bruto_kg"
                label="Peso Bruto (kg) *"
                outlined
                @update:model-value="(val) => (produto.peso_bruto_kg = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="produto.altura_cm"
                label="Altura (cm) *"
                outlined
                @update:model-value="(val) => (produto.altura_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="produto.largura_cm"
                label="Largura (cm) *"
                outlined
                @update:model-value="(val) => (produto.largura_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="produto.profundidade_cm"
                label="Profundidade (cm) *"
                outlined
                @update:model-value="(val) => (produto.profundidade_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>
        </div>

        <!-- Dimensões e Peso para Ar-condicionado -->
        <div v-else>
          <div class="text-h6 q-mt-md q-mb-sm">Dimensões e Peso - Unidade Interna</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="produto.peso_liquido_interno_kg"
                label="Peso Líquido (kg) *"
                outlined
                @update:model-value="
                  (val) => (produto.peso_liquido_interno_kg = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="produto.peso_bruto_interno_kg"
                label="Peso Bruto (kg) *"
                outlined
                @update:model-value="
                  (val) => (produto.peso_bruto_interno_kg = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="produto.altura_interno_cm"
                label="Altura (cm) *"
                outlined
                @update:model-value="(val) => (produto.altura_interno_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="produto.largura_interno_cm"
                label="Largura (cm) *"
                outlined
                @update:model-value="(val) => (produto.largura_interno_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="produto.profundidade_interno_cm"
                label="Profundidade (cm) *"
                outlined
                @update:model-value="
                  (val) => (produto.profundidade_interno_cm = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>

          <!-- Toggle para unidade externa -->
          <div class="q-mt-md q-mb-sm">
            <q-toggle
              v-model="temUnidadeExterna"
              label="Possui unidade externa? (Split/Cassete)"
              color="primary"
              @update:model-value="onUnidadeExternaChange"
            />
            <div v-if="autoDetectadoExterna" class="text-caption text-grey-7 q-mt-xs">
              <q-icon name="info" size="xs" /> Detectado automaticamente pela subcategoria
            </div>
          </div>

          <!-- Dimensões e Peso - Unidade Externa -->
          <div v-if="temUnidadeExterna">
            <div class="text-h6 q-mt-md q-mb-sm">Dimensões e Peso - Unidade Externa</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="produto.peso_liquido_externo_kg"
                  label="Peso Líquido (kg) *"
                  outlined
                  @update:model-value="
                    (val) => (produto.peso_liquido_externo_kg = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="produto.peso_bruto_externo_kg"
                  label="Peso Bruto (kg) *"
                  outlined
                  @update:model-value="
                    (val) => (produto.peso_bruto_externo_kg = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="produto.altura_externo_cm"
                  label="Altura (cm) *"
                  outlined
                  @update:model-value="(val) => (produto.altura_externo_cm = normalizeDecimal(val))"
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="produto.largura_externo_cm"
                  label="Largura (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (produto.largura_externo_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="produto.profundidade_externo_cm"
                  label="Profundidade (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (produto.profundidade_externo_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
            </div>
          </div>
        </div>

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
    subcategorias: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['success'],
  setup(props, { emit }) {
    const { addProduto, uploadProductImages } = useApi()
    const loading = ref(false)
    const imagePreviews = ref([])
    const isArCondicionado = ref(false)
    const temUnidadeExterna = ref(false)
    const autoDetectadoAr = ref(false)
    const autoDetectadoExterna = ref(false)

    const produto = ref({
      categoria: null,
      subcategoria: null,
      marca: null,
      nome: '',
      descricao: '',
      imagens: [],

      // Campos para Ventilador
      peso_liquido_kg: null,
      peso_bruto_kg: null,
      altura_cm: null,
      largura_cm: null,
      profundidade_cm: null,

      // Campos para Ar-condicionado - Unidade Interna
      peso_liquido_interno_kg: null,
      peso_bruto_interno_kg: null,
      altura_interno_cm: null,
      largura_interno_cm: null,
      profundidade_interno_cm: null,

      // Campos para Ar-condicionado - Unidade Externa
      peso_liquido_externo_kg: null,
      peso_bruto_externo_kg: null,
      altura_externo_cm: null,
      largura_externo_cm: null,
      profundidade_externo_cm: null,
    })

    // Detecta automaticamente se é ar-condicionado pela categoria
    const onCategoriaChange = (categoria) => {
      const categoriaNome = categoria?.nome || ''
      const isAr =
        categoriaNome.toLowerCase().includes('ar-condicionado') ||
        categoriaNome.toLowerCase().includes('ar condicionado') ||
        categoriaNome.toLowerCase().includes('condicionador')

      if (isAr) {
        isArCondicionado.value = true
        autoDetectadoAr.value = true
      } else {
        isArCondicionado.value = false
        autoDetectadoAr.value = false
        temUnidadeExterna.value = false
        autoDetectadoExterna.value = false
      }

      // Limpa subcategoria quando muda categoria
      produto.value.subcategoria = null
    }

    // Detecta automaticamente se tem unidade externa pela subcategoria
    const onSubcategoriaChange = (subcategoria) => {
      if (!isArCondicionado.value) return

      const subcategoriaNome = subcategoria?.nome || ''
      const temExterna =
        subcategoriaNome.toLowerCase().includes('dual inverter') ||
        subcategoriaNome.toLowerCase().includes('inverter') ||
        subcategoriaNome.toLowerCase().includes('split') ||
        subcategoriaNome.toLowerCase().includes('cassete') ||
        subcategoriaNome.toLowerCase().includes('piso-teto') ||
        subcategoriaNome.toLowerCase().includes('piso teto')

      if (temExterna) {
        temUnidadeExterna.value = true
        autoDetectadoExterna.value = true
      } else {
        temUnidadeExterna.value = false
        autoDetectadoExterna.value = false
      }
    }

    const onTipoChange = (isAr) => {
      // Se mudou manualmente, desativa auto-detecção
      autoDetectadoAr.value = false

      // Limpa os campos quando muda de tipo
      if (isAr) {
        // Mudou para ar-condicionado, limpa campos de ventilador
        produto.value.peso_liquido_kg = null
        produto.value.peso_bruto_kg = null
        produto.value.altura_cm = null
        produto.value.largura_cm = null
        produto.value.profundidade_cm = null
      } else {
        // Mudou para ventilador, limpa campos de ar-condicionado
        produto.value.peso_liquido_interno_kg = null
        produto.value.peso_bruto_interno_kg = null
        produto.value.altura_interno_cm = null
        produto.value.largura_interno_cm = null
        produto.value.profundidade_interno_cm = null
        produto.value.peso_liquido_externo_kg = null
        produto.value.peso_bruto_externo_kg = null
        produto.value.altura_externo_cm = null
        produto.value.largura_externo_cm = null
        produto.value.profundidade_externo_cm = null
        temUnidadeExterna.value = false
        autoDetectadoExterna.value = false
      }
    }

    const onUnidadeExternaChange = (temExterna) => {
      // Se mudou manualmente, desativa auto-detecção
      autoDetectadoExterna.value = false

      if (!temExterna) {
        // Limpa campos da unidade externa
        produto.value.peso_liquido_externo_kg = null
        produto.value.peso_bruto_externo_kg = null
        produto.value.altura_externo_cm = null
        produto.value.largura_externo_cm = null
        produto.value.profundidade_externo_cm = null
      }
    }

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
          subcategoria_id: produto.value.subcategoria?.id || produto.value.subcategoria,
          marca_id: produto.value.marca?.id || produto.value.marca,
          path_imagens: pathImagens,

          // Campos de ventilador
          peso_liquido_kg: produto.value.peso_liquido_kg,
          peso_bruto_kg: produto.value.peso_bruto_kg,
          altura_cm: produto.value.altura_cm,
          largura_cm: produto.value.largura_cm,
          profundidade_cm: produto.value.profundidade_cm,

          // Campos de ar-condicionado - interno
          peso_liquido_interno_kg: produto.value.peso_liquido_interno_kg,
          peso_bruto_interno_kg: produto.value.peso_bruto_interno_kg,
          altura_interno_cm: produto.value.altura_interno_cm,
          largura_interno_cm: produto.value.largura_interno_cm,
          profundidade_interno_cm: produto.value.profundidade_interno_cm,

          // Campos de ar-condicionado - externo
          peso_liquido_externo_kg: produto.value.peso_liquido_externo_kg,
          peso_bruto_externo_kg: produto.value.peso_bruto_externo_kg,
          altura_externo_cm: produto.value.altura_externo_cm,
          largura_externo_cm: produto.value.largura_externo_cm,
          profundidade_externo_cm: produto.value.profundidade_externo_cm,
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
        subcategoria: null,
        marca: null,
        nome: '',
        descricao: '',
        imagens: null,

        peso_liquido_kg: null,
        peso_bruto_kg: null,
        altura_cm: null,
        largura_cm: null,
        profundidade_cm: null,

        peso_liquido_interno_kg: null,
        peso_bruto_interno_kg: null,
        altura_interno_cm: null,
        largura_interno_cm: null,
        profundidade_interno_cm: null,

        peso_liquido_externo_kg: null,
        peso_bruto_externo_kg: null,
        altura_externo_cm: null,
        largura_externo_cm: null,
        profundidade_externo_cm: null,
      }
      isArCondicionado.value = false
      temUnidadeExterna.value = false
      autoDetectadoAr.value = false
      autoDetectadoExterna.value = false
      clearImagePreviews()
    }

    const normalizeDecimal = (value) => {
      if (!value) return value
      return value.toString().replace(',', '.')
    }

    return {
      produto,
      loading,
      imagePreviews,
      isArCondicionado,
      temUnidadeExterna,
      autoDetectadoAr,
      autoDetectadoExterna,
      handleImageChange,
      handleSave,
      removeImagem,
      reset,
      normalizeDecimal,
      onCategoriaChange,
      onSubcategoriaChange,
      onTipoChange,
      onUnidadeExternaChange,
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
