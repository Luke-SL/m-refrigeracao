<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6">Cadastrar Variação de Produto</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="handleSave" class="q-gutter-md">
        <q-select
          v-model="variacao.produto"
          :options="produtos"
          label="Produto *"
          outlined
          option-label="nome"
          option-value="id"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        >
          <template v-slot:selected-item="scope">
            <div class="row items-center q-gutter-sm">
              <q-avatar v-if="scope.opt.thumbnail" rounded size="32px">
                <img :src="scope.opt.thumbnail" />
              </q-avatar>
              <q-avatar v-else rounded size="32px" color="grey-4" icon="image" />
              <div>{{ scope.opt.nome }}</div>
            </div>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-avatar v-if="scope.opt.thumbnail" rounded size="48px">
                  <img :src="scope.opt.thumbnail" />
                </q-avatar>
                <q-avatar v-else rounded size="48px" color="grey-4" icon="image" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.nome }}</q-item-label>
                <q-item-label caption>
                  {{ scope.opt.marca?.nome }} - {{ scope.opt.categoria?.nome }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <div class="row q-col-gutter-md">
          <div class="col-12" :class="isArCondicionado ? 'col-md-4' : 'col-md-12'">
            <q-select
              v-model="variacao.voltagem"
              :options="['110V', '220V', 'Bivolt']"
              label="Voltagem *"
              outlined
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
          <div v-if="isArCondicionado" class="col-12 col-md-4">
            <q-select
              v-model="variacao.tipo"
              :options="['Quente e Frio', 'Só Frio']"
              label="Tipo *"
              outlined
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
          <div v-if="isArCondicionado" class="col-12 col-md-4">
            <q-input
              v-model="variacao.btus"
              label="BTUs *"
              outlined
              type="number"
              min="0"
              :rules="[(val) => (val !== null && val !== '') || 'Campo obrigatório']"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="variacao.garantia"
              label="Garantia (meses) *"
              outlined
              type="number"
              min="0"
              hint="Ex: 12 para 1 ano"
              :rules="[(val) => (val !== null && val !== '') || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-md-8">
            <q-input
              v-model="variacao.estoque"
              label="Estoque *"
              outlined
              type="number"
              min="0"
              :rules="[(val) => (val !== null && val !== '') || 'Campo obrigatório']"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="precoFormatado"
              label="Preço *"
              prefix="R$ "
              outlined
              @update:model-value="formatarPreco"
              :rules="[(val) => (val !== null && val !== '') || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="variacao.descontoVista"
              label="Desconto à Vista (%)"
              outlined
              type="number"
              min="0"
              max="100"
              hint="0 a 100 (0 = sem desconto)"
            />
          </div>
        </div>

        <div class="text-h6 q-mt-md q-mb-sm">Dimensões e Peso</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="variacao.pesoLiquido"
              label="Peso Líquido (kg) *"
              outlined
              @update:model-value="(val) => (variacao.pesoLiquido = normalizeDecimal(val))"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="variacao.pesoBruto"
              label="Peso Bruto (kg) *"
              outlined
              @update:model-value="(val) => (variacao.pesoBruto = normalizeDecimal(val))"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="variacao.altura"
              label="Altura (cm) *"
              outlined
              @update:model-value="(val) => (variacao.altura = normalizeDecimal(val))"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="variacao.largura"
              label="Largura (cm) *"
              outlined
              @update:model-value="(val) => (variacao.largura = normalizeDecimal(val))"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="variacao.profundidade"
              label="Profundidade (cm) *"
              outlined
              @update:model-value="(val) => (variacao.profundidade = normalizeDecimal(val))"
              :rules="[(val) => !!val || 'Campo obrigatório']"
            />
          </div>
        </div>

        <div class="text-h6 q-mt-md q-mb-sm">Ficha Técnica</div>
        <div
          v-for="(item, index) in variacao.fichaTecnica"
          :key="index"
          class="row q-col-gutter-md q-mb-sm"
        >
          <div class="col-5">
            <q-input v-model="item.chave" label="Campo" outlined dense />
          </div>
          <div class="col-5">
            <q-input v-model="item.valor" label="Valor" outlined dense />
          </div>
          <div class="col-2 flex items-center">
            <q-btn icon="delete" color="negative" flat dense @click="removeFichaTecnica(index)" />
          </div>
        </div>
        <q-btn
          label="Adicionar Campo"
          icon="add"
          color="secondary"
          outline
          @click="addFichaTecnica"
        />

        <div class="row justify-end q-gutter-sm q-mt-md">
          <q-btn label="Limpar" color="grey" @click="reset" />
          <q-btn label="Salvar" type="submit" color="primary" :loading="loading" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, computed } from 'vue'
import useApi from 'src/composables/useApi'
import { positiveNotify, negativeNotify } from 'src/composables/UseNotify'
import { formatCurrency } from 'src/utils/format'

export default {
  name: 'FormVariacao',
  props: {
    produtos: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['success'],
  setup(props, { emit }) {
    const { addProdutoVariacao } = useApi()
    const loading = ref(false)
    const precoFormatado = ref('')

    const variacao = ref({
      produto: null,
      voltagem: '',
      tipo: null,
      btus: null,
      preco: null,
      descontoVista: 0,
      garantia: null,
      estoque: null,
      pesoLiquido: '',
      pesoBruto: '',
      altura: '',
      largura: '',
      profundidade: '',
      fichaTecnica: [],
    })

    const isArCondicionado = computed(() => {
      return variacao.value.produto?.categoria?.nome === 'Ar-Condicionado'
    })

    const formatarPreco = (valor) => {
      if (!valor) {
        variacao.value.preco = null
        precoFormatado.value = ''
        return
      }

      let numero = valor.replace(/\D/g, '')
      if (!numero) {
        variacao.value.preco = null
        precoFormatado.value = ''
        return
      }

      let valorNumerico = parseInt(numero) / 100
      variacao.value.preco = valorNumerico
      precoFormatado.value = formatCurrency(valorNumerico).replace('R$', '').trim()
    }

    const normalizeDecimal = (value) => {
      if (!value) return value
      return value.toString().replace(',', '.')
    }

    const handleSave = async () => {
      try {
        loading.value = true

        const novaVariacao = {
          produto_id: variacao.value.produto?.id || variacao.value.produto,
          voltagem: variacao.value.voltagem,
          tipo: variacao.value.tipo,
          btus: variacao.value.btus || null,
          preco: variacao.value.preco,
          desconto_a_vista: variacao.value.descontoVista || 0,
          garantia: variacao.value.garantia,
          estoque: variacao.value.estoque,
          peso_liquido: variacao.value.pesoLiquido,
          peso_bruto: variacao.value.pesoBruto,
          altura: variacao.value.altura,
          largura: variacao.value.largura,
          profundidade: variacao.value.profundidade,
          ficha_tecnica_url:
            variacao.value.fichaTecnica.length > 0
              ? JSON.stringify(variacao.value.fichaTecnica)
              : null,
        }

        await addProdutoVariacao(novaVariacao)
        positiveNotify('Variação cadastrada com sucesso!')
        reset()
        emit('success')
      } catch (err) {
        negativeNotify(`Erro ao cadastrar variação: ${err.message}`)
      } finally {
        loading.value = false
      }
    }

    const reset = () => {
      variacao.value = {
        produto: null,
        voltagem: '',
        tipo: null,
        btus: null,
        preco: null,
        descontoVista: 0,
        garantia: null,
        estoque: null,
        pesoLiquido: '',
        pesoBruto: '',
        altura: '',
        largura: '',
        profundidade: '',
        fichaTecnica: [],
      }
      precoFormatado.value = ''
    }

    const addFichaTecnica = () => {
      variacao.value.fichaTecnica.push({ chave: '', valor: '' })
    }

    const removeFichaTecnica = (index) => {
      variacao.value.fichaTecnica.splice(index, 1)
    }

    return {
      variacao,
      loading,
      precoFormatado,
      isArCondicionado,
      formatarPreco,
      normalizeDecimal,
      handleSave,
      reset,
      addFichaTecnica,
      removeFichaTecnica,
    }
  },
}
</script>
