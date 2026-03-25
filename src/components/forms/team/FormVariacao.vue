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
          @update:model-value="onProdutoChange"
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

        <q-input
          v-model="variacao.descricao"
          label="Descrição da Variação"
          outlined
          type="textarea"
          rows="2"
          hint="Ex: Split 12000 BTUs 220V Quente e Frio"
        />

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
          <div class="col-12 col-md-4">
            <q-input
              v-model="variacao.estoque"
              label="Estoque *"
              outlined
              type="number"
              min="0"
              :rules="[(val) => (val !== null && val !== '') || 'Campo obrigatório']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="precoFormatado"
              label="Preço *"
              prefix="R$ "
              outlined
              @update:model-value="formatarPreco"
              :rules="[(val) => (val !== null && val !== '') || 'Campo obrigatório']"
            />
          </div>
        </div>

        <q-input
          v-model="variacao.descontoVista"
          label="Desconto à Vista (%)"
          outlined
          type="number"
          min="0"
          max="100"
          hint="0 a 100 (0 = sem desconto)"
        />

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
          <div class="text-h6 q-mt-md q-mb-sm">Peso</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="variacao.peso_liquido_kg"
                label="Peso Líquido (kg) *"
                outlined
                @update:model-value="(val) => (variacao.peso_liquido_kg = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="variacao.peso_bruto_kg"
                label="Peso Bruto (kg) *"
                outlined
                @update:model-value="(val) => (variacao.peso_bruto_kg = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>

          <div class="text-h6 q-mt-md q-mb-sm">Dimensões do Produto</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.largura_cm"
                label="Largura (cm) *"
                outlined
                @update:model-value="(val) => (variacao.largura_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.altura_cm"
                label="Altura (cm) *"
                outlined
                @update:model-value="(val) => (variacao.altura_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.profundidade_cm"
                label="Profundidade (cm) *"
                outlined
                @update:model-value="(val) => (variacao.profundidade_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>

          <div class="text-h6 q-mt-md q-mb-sm">Dimensões Embalado (para frete)</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.largura_embalado_cm"
                label="Largura (cm) *"
                outlined
                @update:model-value="
                  (val) => (variacao.largura_embalado_cm = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.altura_embalado_cm"
                label="Altura (cm) *"
                outlined
                @update:model-value="(val) => (variacao.altura_embalado_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.profundidade_embalado_cm"
                label="Profundidade (cm) *"
                outlined
                @update:model-value="
                  (val) => (variacao.profundidade_embalado_cm = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>
        </div>

        <!-- Dimensões e Peso para Ar-condicionado -->
        <div v-else>
          <div class="text-h6 q-mt-md q-mb-sm">Unidade Interna - Peso</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="variacao.peso_liquido_interno_kg"
                label="Peso Líquido (kg) *"
                outlined
                @update:model-value="
                  (val) => (variacao.peso_liquido_interno_kg = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="variacao.peso_bruto_interno_kg"
                label="Peso Bruto (kg) *"
                outlined
                @update:model-value="
                  (val) => (variacao.peso_bruto_interno_kg = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>

          <div class="text-subtitle1 q-mt-md q-mb-sm">Dimensões do Produto</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.largura_interno_cm"
                label="Largura (cm) *"
                outlined
                @update:model-value="(val) => (variacao.largura_interno_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.altura_interno_cm"
                label="Altura (cm) *"
                outlined
                @update:model-value="(val) => (variacao.altura_interno_cm = normalizeDecimal(val))"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.profundidade_interno_cm"
                label="Profundidade (cm) *"
                outlined
                @update:model-value="
                  (val) => (variacao.profundidade_interno_cm = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
          </div>

          <div class="text-subtitle1 q-mt-md q-mb-sm">Dimensões Embalado (para frete)</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.largura_interno_embalado_cm"
                label="Largura (cm) *"
                outlined
                @update:model-value="
                  (val) => (variacao.largura_interno_embalado_cm = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.altura_interno_embalado_cm"
                label="Altura (cm) *"
                outlined
                @update:model-value="
                  (val) => (variacao.altura_interno_embalado_cm = normalizeDecimal(val))
                "
                :rules="[(val) => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="variacao.profundidade_interno_embalado_cm"
                label="Profundidade (cm) *"
                outlined
                @update:model-value="
                  (val) => (variacao.profundidade_interno_embalado_cm = normalizeDecimal(val))
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
            <div class="text-h6 q-mt-md q-mb-sm">Unidade Externa - Peso</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="variacao.peso_liquido_externo_kg"
                  label="Peso Líquido (kg) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.peso_liquido_externo_kg = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="variacao.peso_bruto_externo_kg"
                  label="Peso Bruto (kg) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.peso_bruto_externo_kg = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
            </div>

            <div class="text-subtitle1 q-mt-md q-mb-sm">Dimensões do Produto</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="variacao.largura_externo_cm"
                  label="Largura (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.largura_externo_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="variacao.altura_externo_cm"
                  label="Altura (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.altura_externo_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="variacao.profundidade_externo_cm"
                  label="Profundidade (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.profundidade_externo_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
            </div>

            <div class="text-subtitle1 q-mt-md q-mb-sm">Dimensões Embalado (para frete)</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="variacao.largura_externo_embalado_cm"
                  label="Largura (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.largura_externo_embalado_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="variacao.altura_externo_embalado_cm"
                  label="Altura (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.altura_externo_embalado_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="variacao.profundidade_externo_embalado_cm"
                  label="Profundidade (cm) *"
                  outlined
                  @update:model-value="
                    (val) => (variacao.profundidade_externo_embalado_cm = normalizeDecimal(val))
                  "
                  :rules="[(val) => !!val || 'Campo obrigatório']"
                />
              </div>
            </div>
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
import { ref } from 'vue'
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
    const isArCondicionado = ref(false)
    const temUnidadeExterna = ref(false)
    const autoDetectadoAr = ref(false)
    const autoDetectadoExterna = ref(false)

    const variacao = ref({
      produto: null,
      descricao: '',
      voltagem: '',
      tipo: null,
      btus: null,
      preco: null,
      descontoVista: 0,
      garantia: null,
      estoque: null,

      // Campos para Ventilador
      peso_liquido_kg: null,
      peso_bruto_kg: null,
      largura_cm: null,
      altura_cm: null,
      profundidade_cm: null,
      largura_embalado_cm: null,
      altura_embalado_cm: null,
      profundidade_embalado_cm: null,

      // Campos para Ar-condicionado - Unidade Interna
      peso_liquido_interno_kg: null,
      peso_bruto_interno_kg: null,
      largura_interno_cm: null,
      altura_interno_cm: null,
      profundidade_interno_cm: null,
      largura_interno_embalado_cm: null,
      altura_interno_embalado_cm: null,
      profundidade_interno_embalado_cm: null,

      // Campos para Ar-condicionado - Unidade Externa
      peso_liquido_externo_kg: null,
      peso_bruto_externo_kg: null,
      largura_externo_cm: null,
      altura_externo_cm: null,
      profundidade_externo_cm: null,
      largura_externo_embalado_cm: null,
      altura_externo_embalado_cm: null,
      profundidade_externo_embalado_cm: null,

      fichaTecnica: [],
    })

    // Detecta automaticamente quando seleciona o produto
    const onProdutoChange = (produto) => {
      const categoriaNome = produto?.categoria?.nome || ''
      const isAr =
        categoriaNome.toLowerCase().includes('ar-condicionado') ||
        categoriaNome.toLowerCase().includes('ar condicionado') ||
        categoriaNome.toLowerCase().includes('condicionador')

      if (isAr) {
        isArCondicionado.value = true
        autoDetectadoAr.value = true

        // Detecta unidade externa pela subcategoria
        const subcategoriaNome = produto?.subcategoria?.nome || ''
        const temExterna =
          subcategoriaNome.toLowerCase().includes('split') ||
          subcategoriaNome.toLowerCase().includes('cassete') ||
          subcategoriaNome.toLowerCase().includes('piso-teto') ||
          subcategoriaNome.toLowerCase().includes('piso teto') ||
          subcategoriaNome.toLowerCase().includes('inverter')

        if (temExterna) {
          temUnidadeExterna.value = true
          autoDetectadoExterna.value = true
        }
      } else {
        isArCondicionado.value = false
        autoDetectadoAr.value = false
        temUnidadeExterna.value = false
        autoDetectadoExterna.value = false
      }
    }

    const onTipoChange = (isAr) => {
      autoDetectadoAr.value = false

      if (isAr) {
        // Limpa campos de ventilador
        variacao.value.peso_liquido_kg = null
        variacao.value.peso_bruto_kg = null
        variacao.value.largura_cm = null
        variacao.value.altura_cm = null
        variacao.value.profundidade_cm = null
        variacao.value.largura_embalado_cm = null
        variacao.value.altura_embalado_cm = null
        variacao.value.profundidade_embalado_cm = null
      } else {
        // Limpa campos de ar-condicionado
        variacao.value.peso_liquido_interno_kg = null
        variacao.value.peso_bruto_interno_kg = null
        variacao.value.largura_interno_cm = null
        variacao.value.altura_interno_cm = null
        variacao.value.profundidade_interno_cm = null
        variacao.value.largura_interno_embalado_cm = null
        variacao.value.altura_interno_embalado_cm = null
        variacao.value.profundidade_interno_embalado_cm = null
        variacao.value.peso_liquido_externo_kg = null
        variacao.value.peso_bruto_externo_kg = null
        variacao.value.largura_externo_cm = null
        variacao.value.altura_externo_cm = null
        variacao.value.profundidade_externo_cm = null
        variacao.value.largura_externo_embalado_cm = null
        variacao.value.altura_externo_embalado_cm = null
        variacao.value.profundidade_externo_embalado_cm = null
        temUnidadeExterna.value = false
        autoDetectadoExterna.value = false
      }
    }

    const onUnidadeExternaChange = (temExterna) => {
      autoDetectadoExterna.value = false

      if (!temExterna) {
        variacao.value.peso_liquido_externo_kg = null
        variacao.value.peso_bruto_externo_kg = null
        variacao.value.largura_externo_cm = null
        variacao.value.altura_externo_cm = null
        variacao.value.profundidade_externo_cm = null
        variacao.value.largura_externo_embalado_cm = null
        variacao.value.altura_externo_embalado_cm = null
        variacao.value.profundidade_externo_embalado_cm = null
      }
    }

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
          descricao: variacao.value.descricao,
          voltagem: variacao.value.voltagem,
          tipo: variacao.value.tipo,
          btus: variacao.value.btus || null,
          preco: variacao.value.preco,
          desconto_a_vista: variacao.value.descontoVista || 0,
          garantia: variacao.value.garantia,
          estoque: variacao.value.estoque,

          // Campos de ventilador
          peso_liquido_kg: variacao.value.peso_liquido_kg,
          peso_bruto_kg: variacao.value.peso_bruto_kg,
          largura_cm: variacao.value.largura_cm,
          altura_cm: variacao.value.altura_cm,
          profundidade_cm: variacao.value.profundidade_cm,
          largura_embalado_cm: variacao.value.largura_embalado_cm,
          altura_embalado_cm: variacao.value.altura_embalado_cm,
          profundidade_embalado_cm: variacao.value.profundidade_embalado_cm,

          // Campos de ar-condicionado - interno
          peso_liquido_interno_kg: variacao.value.peso_liquido_interno_kg,
          peso_bruto_interno_kg: variacao.value.peso_bruto_interno_kg,
          largura_interno_cm: variacao.value.largura_interno_cm,
          altura_interno_cm: variacao.value.altura_interno_cm,
          profundidade_interno_cm: variacao.value.profundidade_interno_cm,
          largura_interno_embalado_cm: variacao.value.largura_interno_embalado_cm,
          altura_interno_embalado_cm: variacao.value.altura_interno_embalado_cm,
          profundidade_interno_embalado_cm: variacao.value.profundidade_interno_embalado_cm,

          // Campos de ar-condicionado - externo
          peso_liquido_externo_kg: variacao.value.peso_liquido_externo_kg,
          peso_bruto_externo_kg: variacao.value.peso_bruto_externo_kg,
          largura_externo_cm: variacao.value.largura_externo_cm,
          altura_externo_cm: variacao.value.altura_externo_cm,
          profundidade_externo_cm: variacao.value.profundidade_externo_cm,
          largura_externo_embalado_cm: variacao.value.largura_externo_embalado_cm,
          altura_externo_embalado_cm: variacao.value.altura_externo_embalado_cm,
          profundidade_externo_embalado_cm: variacao.value.profundidade_externo_embalado_cm,

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
        descricao: '',
        voltagem: '',
        tipo: null,
        btus: null,
        preco: null,
        descontoVista: 0,
        garantia: null,
        estoque: null,

        peso_liquido_kg: null,
        peso_bruto_kg: null,
        largura_cm: null,
        altura_cm: null,
        profundidade_cm: null,
        largura_embalado_cm: null,
        altura_embalado_cm: null,
        profundidade_embalado_cm: null,

        peso_liquido_interno_kg: null,
        peso_bruto_interno_kg: null,
        largura_interno_cm: null,
        altura_interno_cm: null,
        profundidade_interno_cm: null,
        largura_interno_embalado_cm: null,
        altura_interno_embalado_cm: null,
        profundidade_interno_embalado_cm: null,

        peso_liquido_externo_kg: null,
        peso_bruto_externo_kg: null,
        largura_externo_cm: null,
        altura_externo_cm: null,
        profundidade_externo_cm: null,
        largura_externo_embalado_cm: null,
        altura_externo_embalado_cm: null,
        profundidade_externo_embalado_cm: null,

        fichaTecnica: [],
      }
      precoFormatado.value = ''
      isArCondicionado.value = false
      temUnidadeExterna.value = false
      autoDetectadoAr.value = false
      autoDetectadoExterna.value = false
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
      temUnidadeExterna,
      autoDetectadoAr,
      autoDetectadoExterna,
      formatarPreco,
      normalizeDecimal,
      handleSave,
      reset,
      addFichaTecnica,
      removeFichaTecnica,
      onProdutoChange,
      onTipoChange,
      onUnidadeExternaChange,
    }
  },
}
</script>
