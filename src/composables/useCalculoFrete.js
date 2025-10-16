// src/composables/useCalculoFrete.js
import { ref } from 'vue'

export function useCalculoFrete() {
  const fretesDisponiveis = ref([])
  const loadingFrete = ref(false)
  const errorFrete = ref(null)
  const cepValido = ref(false)
  const enderecoCompleto = ref(null)

  /**
   * Valida e busca informações do CEP
   */
  const validarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '')

    if (cepLimpo.length !== 8) {
      return { valido: false, erro: 'CEP deve conter 8 dígitos' }
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const dados = await response.json()

      if (dados.erro) {
        return { valido: false, erro: 'CEP não encontrado' }
      }

      enderecoCompleto.value = {
        cep: cepLimpo,
        logradouro: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      }

      cepValido.value = true
      return { valido: true, dados: enderecoCompleto.value }
    } catch (error) {
      return { valido: false, erro: error.message }
    }
  }

  /**
   * Calcula frete para o produto
   */
  const calcularFrete = async (cepDestino, produto) => {
    loadingFrete.value = true
    errorFrete.value = null
    fretesDisponiveis.value = []

    try {
      // 1. Valida CEP primeiro
      const validacao = await validarCEP(cepDestino)
      if (!validacao.valido) {
        throw new Error(validacao.erro)
      }

      // 2. Prepara dados do produto
      const dadosProduto = {
        peso: produto.peso_bruto || produto.peso_liquido || 1, // em kg
        altura: produto.altura || 10, // em cm
        largura: produto.largura || 10,
        comprimento: produto.profundidade || 10,
        valor: produto.discount
          ? produto.price - (produto.price * produto.discount) / 100
          : produto.price,
      }

      // 3. Chama API do backend para calcular frete
      const response = await fetch('/api/calcular-frete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cepDestino: cepDestino.replace(/\D/g, ''),
          produto: dadosProduto,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao calcular frete')
      }

      const resultado = await response.json()
      fretesDisponiveis.value = resultado.fretes || []

      return {
        sucesso: true,
        fretes: fretesDisponiveis.value,
        endereco: enderecoCompleto.value,
      }
    } catch (error) {
      errorFrete.value = error.message
      return {
        sucesso: false,
        erro: error.message,
      }
    } finally {
      loadingFrete.value = false
    }
  }

  /**
   * Simula cálculo de frete (para desenvolvimento/teste)
   * Remove este método quando integrar com API real
   */
  const simularFrete = async (cepDestino, produto) => {
    loadingFrete.value = true
    errorFrete.value = null

    try {
      const validacao = await validarCEP(cepDestino)
      if (!validacao.valido) {
        throw new Error(validacao.erro)
      }

      // Simula delay da API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Calcula valores baseados em distância estimada (simplificado)
      const peso = produto.peso_bruto || produto.peso_liquido || 1
      const baseValor = peso * 8 // R$ 8 por kg base

      fretesDisponiveis.value = [
        {
          id: 'pac',
          nome: 'PAC',
          servico: 'Correios',
          prazo: Math.floor(Math.random() * 5) + 5, // 5-10 dias
          valor: baseValor + Math.random() * 10,
          tipo: 'economico',
        },
        {
          id: 'sedex',
          nome: 'SEDEX',
          servico: 'Correios',
          prazo: Math.floor(Math.random() * 3) + 2, // 2-5 dias
          valor: baseValor * 1.8 + Math.random() * 15,
          tipo: 'expresso',
        },
        {
          id: 'transportadora',
          nome: 'Transportadora',
          servico: 'Loggi',
          prazo: Math.floor(Math.random() * 4) + 3, // 3-7 dias
          valor: baseValor * 1.3 + Math.random() * 12,
          tipo: 'normal',
        },
      ].sort((a, b) => a.valor - b.valor) // Ordena por preço

      return {
        sucesso: true,
        fretes: fretesDisponiveis.value,
        endereco: enderecoCompleto.value,
      }
    } catch (error) {
      errorFrete.value = error.message
      return {
        sucesso: false,
        erro: error.message,
      }
    } finally {
      loadingFrete.value = false
    }
  }

  /**
   * Limpa os dados de frete
   */
  const limparFrete = () => {
    fretesDisponiveis.value = []
    errorFrete.value = null
    cepValido.value = false
    enderecoCompleto.value = null
  }

  return {
    // Estado
    fretesDisponiveis,
    loadingFrete,
    errorFrete,
    cepValido,
    enderecoCompleto,

    // Métodos
    validarCEP,
    calcularFrete,
    simularFrete, // Use este durante desenvolvimento
    limparFrete,
  }
}
