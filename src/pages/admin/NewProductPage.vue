<template>
  <q-layout view="hHh lpR fFf">
    <q-page class="q-pa-md scroll fit">
      <div class="row" :class="$q.screen.lt.lg ? 'column' : ''">
        <!-- Botões de navegação -->
        <div :class="$q.screen.lt.lg ? 'col-12 q-mb-md' : 'col-2 q-pr-md'">
          <div :class="$q.screen.lt.lg ? 'row q-gutter-sm' : 'column q-gutter-sm'">
            <q-btn
              :class="$q.screen.lt.lg ? '' : 'full-width'"
              color="primary"
              label="Cadastrar Produto"
              @click="currentForm = 'produto'"
              :outline="currentForm !== 'produto'"
            />
            <q-btn
              :class="$q.screen.lt.lg ? '' : 'full-width'"
              color="primary"
              label="Cadastrar Variação"
              @click="currentForm = 'variacao'"
              :outline="currentForm !== 'variacao'"
            />
            <q-btn
              :class="$q.screen.lt.lg ? '' : 'full-width'"
              color="secondary"
              label="Cadastrar Marca"
              @click="currentForm = 'marca'"
              :outline="currentForm !== 'marca'"
            />
            <q-btn
              :class="$q.screen.lt.lg ? '' : 'full-width'"
              color="secondary"
              label="Cadastrar Categoria"
              @click="currentForm = 'categoria'"
              :outline="currentForm !== 'categoria'"
            />
            <q-btn
              :class="$q.screen.lt.lg ? '' : 'full-width'"
              color="secondary"
              label="Cadastrar Subcategoria"
              @click="currentForm = 'subcategoria'"
              :outline="currentForm !== 'subcategoria'"
            />
          </div>
        </div>

        <!-- Formulários -->
        <div :class="$q.screen.lt.lg ? 'col-12' : 'col-10'">
          <FormMarca v-if="currentForm === 'marca'" @success="handleSuccess" />

          <FormCategoria v-if="currentForm === 'categoria'" @success="handleSuccess" />

          <FormSubcategoria
            v-if="currentForm === 'subcategoria'"
            :categorias="categorias"
            @success="handleSuccess"
          />

          <FormProduto
            v-if="currentForm === 'produto'"
            :marcas="marcas"
            :categorias="categorias"
            :subcategorias="subcategorias"
            @success="handleSuccess"
          />

          <FormVariacao
            v-if="currentForm === 'variacao'"
            :produtos="produtos"
            @success="handleSuccess"
          />
        </div>
      </div>
    </q-page>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import useApi from 'src/composables/useApi'
import { negativeNotify } from 'src/composables/UseNotify'
import FormMarca from 'src/components/forms/team/FormMarca.vue'
import FormCategoria from 'src/components/forms/team/FormCategoria.vue'
import FormProduto from 'src/components/forms/team/FormProduto.vue'
import FormVariacao from 'src/components/forms/team/FormVariacao.vue'
import FormSubcategoria from 'src/components/forms/team/FormSubcategoria.vue'

export default {
  name: 'CadastroProdutos',
  components: {
    FormMarca,
    FormCategoria,
    FormProduto,
    FormVariacao,
    FormSubcategoria,
  },
  setup() {
    const currentForm = ref('produto')
    const { getMarcas, getCategorias, getProdutos, getProductImages, getSubcategorias } = useApi()

    const marcas = ref([])
    const categorias = ref([])
    const subcategorias = ref([])
    const produtos = ref([])

    const loadSelects = async () => {
      try {
        const marcasData = await getMarcas()
        marcas.value = marcasData

        const categoriasData = await getCategorias()
        categorias.value = categoriasData

        const subcategoriaData = await getSubcategorias()
        subcategorias.value = subcategoriaData

        const produtosData = await getProdutos()
        produtos.value = await Promise.all(
          produtosData.map(async (produto) => {
            if (produto.path_imagens) {
              const images = await getProductImages(produto.path_imagens)
              return {
                ...produto,
                thumbnail: images.length > 0 ? images[0] : null,
              }
            }
            return {
              ...produto,
              thumbnail: null,
            }
          }),
        )
      } catch (error) {
        negativeNotify(error.message || 'Erro ao carregar dados.')
      }
    }

    const handleSuccess = () => {
      loadSelects()
    }

    onMounted(() => {
      loadSelects()
    })

    return {
      currentForm,
      marcas,
      categorias,
      subcategorias,
      produtos,
      handleSuccess,
    }
  },
}
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
}
</style>
