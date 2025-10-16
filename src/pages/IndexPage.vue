<template>
  <div>
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      class="carousel-fullwidth"
      height="56.25vw"
    >
      <q-carousel-slide
        :name="1"
        class="flex items-center justify-center"
        img-src="/carousel/xo-calor.png"
      />
      <q-carousel-slide
        :name="2"
        class="flex items-center justify-center"
        img-src="/carousel/oferta-1.png"
      />
      <q-carousel-slide
        :name="4"
        class="flex items-center justify-center"
        img-src="/carousel/oferta-2.png"
      />
    </q-carousel>
  </div>

  <q-page class="flex">
    <!-- Loading State -->
    <div v-if="loading" class="full-width text-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
      <p class="q-mt-md text-grey-6">Carregando produtos...</p>
    </div>

    <!-- Produtos -->
    <div v-else class="full-width">
      <!-- Componente reutilizável para cada categoria -->
      <ProductSection
        v-if="produtosArCondicionado.length > 0"
        title="Ar-Condicionado"
        :produtos="produtosArCondicionado"
        @product-click="goToProduct"
      />

      <ProductSection
        v-if="produtosVentiladores.length > 0"
        title="Ventiladores"
        :produtos="produtosVentiladores"
        @product-click="goToProduct"
      />

      <!-- Mensagem quando não há produtos -->
      <div
        v-if="produtosArCondicionado.length === 0 && produtosVentiladores.length === 0"
        class="full-width text-center q-pa-xl"
      >
        <q-icon name="mdi-package-variant" size="4rem" color="grey-5" />
        <p class="text-h6 text-grey-6 q-mt-md">Nenhum produto disponível no momento</p>
        <p class="text-body2 text-grey-5">
          Verifique se há produtos cadastrados nas categorias "Ar-Condicionado" ou "Ventilador"
        </p>
      </div>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>
.carousel-fullwidth
  width: 100%
  height: 56.25vw
  max-height: 350px

  :deep(.q-carousel__slide)
    background-size: cover !important
    background-repeat: no-repeat !important
    background-position: center !important
</style>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { negativeNotify } from 'src/composables/UseNotify'
import useApi from 'src/composables/useApi'
import ProductSection from 'src/components/ProductSection.vue'

export default {
  components: {
    ProductSection,
  },
  setup() {
    const router = useRouter()
    const { getProdutosArCondicionado, getProdutosVentiladores } = useApi()

    const slide = ref(1)
    const autoplay = ref(true)
    const loading = ref(true)
    const produtosArCondicionado = ref([])
    const produtosVentiladores = ref([])

    const goToProduct = (product) => {
      router.push(`/product/${product.id}`)
    }

    const carregarProdutos = async () => {
      loading.value = true
      try {
        const [arCondicionado, ventiladores] = await Promise.all([
          getProdutosArCondicionado(),
          getProdutosVentiladores(),
        ])

        produtosArCondicionado.value = arCondicionado
        produtosVentiladores.value = ventiladores
      } catch (error) {
        negativeNotify('Erro ao carregar produtos:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      carregarProdutos()
    })

    return {
      slide,
      autoplay,
      loading,
      produtosArCondicionado,
      produtosVentiladores,
      goToProduct,
    }
  },
}
</script>
