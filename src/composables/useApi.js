// src/composables/useApi.js
import useSupabase from 'src/boot/supabase'
import useAuthUser from './UseAuthUser'
import { positiveNotify, negativeNotify } from './UseNotify'
import { v4 as uuidv4 } from 'uuid'

export default function useApi() {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()

  const table_marca = 'marca'
  const table_categoria = 'categoria'
  const table_subcategoria = 'subcategoria'
  const table_produto = 'produto'
  const table_produto_variacao = 'produto_variacao'
  const table_estabelecimento = 'estabelecimento'
  const table_estoque_estabelecimento = 'estoque_estabelecimento'
  const table_time_comercio = 'time_comercio'

  // =====================================================
  // HELPER: Buscar estabelecimento do usuário
  // =====================================================
  const getUserEstabelecimento = async () => {
    if (!user.value) return null

    try {
      const { data, error } = await supabase
        .from(table_time_comercio)
        .select(
          `
          estabelecimento_id,
          cargo,
          estabelecimento:estabelecimento_id (
            id,
            nome,
            tipo,
            cidade,
            estado
          )
        `,
        )
        .eq('usuario_id', user.value.id)
        .eq('ativo', true)
        .single()

      if (error) {
        console.warn('⚠️ Usuário não tem estabelecimento vinculado:', error.message)
        return null
      }

      return data.estabelecimento
    } catch (err) {
      console.error('❌ Erro ao buscar estabelecimento do usuário:', err)
      return null
    }
  }

  // =====================================================
  // MARCAS
  // =====================================================
  const addMarca = async (form) => {
    const { data, error } = await supabase.from(table_marca).insert([
      {
        nome: form.nome,
        usuario_id: user.value.id,
      },
    ])
    if (error) throw error
    return data
  }

  const getMarcas = async () => {
    const { data, error } = await supabase.from(table_marca).select('*')
    if (error) throw error
    return data
  }

  // =====================================================
  // CATEGORIAS
  // =====================================================
  const addCategoria = async (form) => {
    const { data, error } = await supabase.from(table_categoria).insert([
      {
        nome: form.nome,
        usuario_id: user.value.id,
      },
    ])
    if (error) throw error
    return data
  }

  const getCategorias = async () => {
    const { data, error } = await supabase.from(table_categoria).select('*')
    if (error) throw error
    return data
  }

  // =====================================================
  // SUBCATEGORIAS
  // =====================================================
  const addSubcategoria = async (form) => {
    const { data, error } = await supabase.from(table_subcategoria).insert([
      {
        nome: form.nome,
        categoria_id: form.categoria.id,
        usuario_id: user.value.id,
      },
    ])
    if (error) throw error
    return data
  }

  const getSubcategorias = async () => {
    const { data, error } = await supabase.from(table_subcategoria).select('*')
    if (error) throw error
    return data
  }

  // =====================================================
  // PRODUTOS
  // =====================================================
  const addProduto = async (form) => {
    const { data, error } = await supabase
      .from(table_produto)
      .insert([
        {
          nome: form.nome,
          categoria_id: form.categoria_id,
          subcategoria_id: form.subcategoria_id,
          marca_id: form.marca_id,
          usuario_id: user.value.id,
          path_imagens: form.path_imagens,
        },
      ])
      .select('id')

    if (error) {
      throw error
    }

    return { data: data[0], error: null }
  }

  const getProdutos = async () => {
    const { data, error } = await supabase
      .from(table_produto)
      .select(
        `
        *,
        categoria:categoria_id(nome),
        subcategoria:subcategoria_id(nome),
        marca:marca_id(nome)
      `,
      )
      .order('nome', { ascending: true })

    if (error) throw error
    return data
  }

  // =====================================================
  // VARIAÇÕES DE PRODUTOS
  // =====================================================
  const addProdutoVariacao = async (form) => {
    try {
      console.log('📦 Iniciando cadastro de variação...')
      console.log('📦 Dados recebidos:', form)

      // Busca o estabelecimento do usuário logado
      const userEstabelecimento = await getUserEstabelecimento()

      console.log('🏢 Estabelecimento do usuário:', userEstabelecimento)

      if (!userEstabelecimento) {
        negativeNotify(
          'Você não tem estabelecimento vinculado. Entre em contato com o administrador.',
        )
        return { data: null, error: new Error('Sem estabelecimento vinculado') }
      }

      // Insere a variação
      const { data: variacaoData, error: variacaoError } = await supabase
        .from(table_produto_variacao)
        .insert([
          {
            produto_id: form.produto_id,
            descricao: form.descricao,
            voltagem: form.voltagem,
            tipo: form.tipo,
            btus: form.btus || null,
            preco: form.preco,
            desconto_a_vista: form.desconto_a_vista || 0,
            garantia: form.garantia,

            // Campos de ventilador
            peso_liquido_kg: form.peso_liquido_kg,
            peso_bruto_kg: form.peso_bruto_kg,
            largura_cm: form.largura_cm,
            altura_cm: form.altura_cm,
            profundidade_cm: form.profundidade_cm,
            largura_embalado_cm: form.largura_embalado_cm,
            altura_embalado_cm: form.altura_embalado_cm,
            profundidade_embalado_cm: form.profundidade_embalado_cm,

            // Campos de ar-condicionado - interno
            peso_liquido_interno_kg: form.peso_liquido_interno_kg,
            peso_bruto_interno_kg: form.peso_bruto_interno_kg,
            largura_interno_cm: form.largura_interno_cm,
            altura_interno_cm: form.altura_interno_cm,
            profundidade_interno_cm: form.profundidade_interno_cm,
            largura_interno_embalado_cm: form.largura_interno_embalado_cm,
            altura_interno_embalado_cm: form.altura_interno_embalado_cm,
            profundidade_interno_embalado_cm: form.profundidade_interno_embalado_cm,

            // Campos de ar-condicionado - externo
            peso_liquido_externo_kg: form.peso_liquido_externo_kg,
            peso_bruto_externo_kg: form.peso_bruto_externo_kg,
            largura_externo_cm: form.largura_externo_cm,
            altura_externo_cm: form.altura_externo_cm,
            profundidade_externo_cm: form.profundidade_externo_cm,
            largura_externo_embalado_cm: form.largura_externo_embalado_cm,
            altura_externo_embalado_cm: form.altura_externo_embalado_cm,
            profundidade_externo_embalado_cm: form.profundidade_externo_embalado_cm,

            ficha_tecnica_url: form.ficha_tecnica_url || null,
          },
        ])
        .select('id')
        .single()

      if (variacaoError) {
        console.error('❌ Erro ao inserir variação:', variacaoError)
        throw variacaoError
      }

      console.log('✅ Variação criada com ID:', variacaoData.id)

      // Registra estoque inicial no estabelecimento do usuário
      if (form.estoque && form.estoque > 0) {
        console.log('📊 Tentando registrar estoque:', {
          estabelecimento_id: userEstabelecimento.id,
          estabelecimento_nome: userEstabelecimento.nome,
          variacao_id: variacaoData.id,
          quantidade: form.estoque,
          usuario_id: user.value.id,
        })

        const { data: estoqueResult, error: estoqueError } = await supabase.rpc('ajustar_estoque', {
          p_estabelecimento_id: userEstabelecimento.id,
          p_variacao_id: variacaoData.id,
          p_quantidade: parseInt(form.estoque),
          p_tipo: 'entrada',
          p_usuario_id: user.value.id,
          p_observacao: `Estoque inicial cadastrado em ${userEstabelecimento.nome}`,
        })

        if (estoqueError) {
          console.error('❌ Erro ao registrar estoque:', estoqueError)
          negativeNotify(
            `Variação cadastrada mas houve erro ao registrar estoque: ${estoqueError.message}`,
          )
        } else {
          console.log('✅ Estoque registrado com sucesso:', estoqueResult)
          positiveNotify(
            `Variação cadastrada com ${form.estoque} unidade(s) em ${userEstabelecimento.nome}!`,
          )
        }
      } else {
        console.log('⚠️ Nenhum estoque inicial informado')
        positiveNotify('Variação adicionada com sucesso!')
      }

      return { data: variacaoData, error: null }
    } catch (err) {
      console.error('❌ Erro geral:', err)
      negativeNotify(`Erro ao adicionar variação: ${err.message}`)
      return { data: null, error: err }
    }
  }

  const getProdutoVariacoes = async (produtoId = null) => {
    let query = supabase
      .from(table_produto_variacao)
      .select(
        `
        *,
        produto:produto_id(
          nome,
          marca_id,
          categoria_id,
          marca:marca_id(nome),
          categoria:categoria_id(nome),
          subcategoria:subcategoria_id(nome)
        )
      `,
      )
      .order('created_at', { ascending: false })

    if (produtoId) {
      query = query.eq('produto_id', produtoId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // =====================================================
  // ESTABELECIMENTOS
  // =====================================================
  const getEstabelecimentos = async () => {
    const { data, error } = await supabase
      .from(table_estabelecimento)
      .select(
        `
        *,
        gerente:gerente_id(id, perfil_usuario(nome, sobrenome))
      `,
      )
      .eq('ativo', true)
      .order('tipo', { ascending: false }) // Matriz primeiro
      .order('nome')

    if (error) throw error
    return data
  }

  const getEstabelecimentoById = async (id) => {
    const { data, error } = await supabase
      .from(table_estabelecimento)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  const addEstabelecimento = async (form) => {
    const { data, error } = await supabase
      .from(table_estabelecimento)
      .insert([form])
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateEstabelecimento = async (id, form) => {
    const { data, error } = await supabase
      .from(table_estabelecimento)
      .update(form)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // =====================================================
  // ESTOQUE
  // =====================================================

  // Buscar estoque de um estabelecimento
  const getEstoqueByEstabelecimento = async (estabelecimentoId) => {
    const { data, error } = await supabase
      .from('v_estoque_detalhado')
      .select('*')
      .eq('estabelecimento_id', estabelecimentoId)
      .order('produto_nome')

    if (error) throw error
    return data
  }

  // Buscar estoque consolidado (todos estabelecimentos)
  const getEstoqueConsolidado = async () => {
    const { data, error } = await supabase
      .from('v_estoque_consolidado')
      .select('*')
      .order('produto_nome')

    if (error) throw error
    return data
  }

  // Buscar estoque de uma variação específica em todos estabelecimentos
  const getEstoqueByVariacao = async (variacaoId) => {
    const { data, error } = await supabase
      .from('v_estoque_detalhado')
      .select('*')
      .eq('variacao_id', variacaoId)

    if (error) throw error
    return data
  }

  // Ajustar estoque (entrada, saída ou ajuste)
  const ajustarEstoque = async (
    estabelecimentoId,
    variacaoId,
    quantidade,
    tipo,
    observacao = null,
  ) => {
    const { data, error } = await supabase.rpc('ajustar_estoque', {
      p_estabelecimento_id: estabelecimentoId,
      p_variacao_id: variacaoId,
      p_quantidade: quantidade,
      p_tipo: tipo,
      p_usuario_id: user.value.id,
      p_observacao: observacao,
    })

    if (error) throw error
    return data
  }

  // Transferir estoque entre estabelecimentos
  const transferirEstoque = async (
    estabelecimentoOrigemId,
    estabelecimentoDestinoId,
    variacaoId,
    quantidade,
    observacao = null,
  ) => {
    const { data, error } = await supabase.rpc('transferir_estoque', {
      p_estabelecimento_origem_id: estabelecimentoOrigemId,
      p_estabelecimento_destino_id: estabelecimentoDestinoId,
      p_variacao_id: variacaoId,
      p_quantidade: quantidade,
      p_usuario_id: user.value.id,
      p_observacao: observacao,
    })

    if (error) throw error
    return data
  }

  // Buscar movimentações de estoque
  const getMovimentacoes = async (estabelecimentoId = null, variacaoId = null, limit = 100) => {
    let query = supabase
      .from('v_movimentacoes_detalhado')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (estabelecimentoId) {
      query = query.eq('estabelecimento_id', estabelecimentoId)
    }

    if (variacaoId) {
      query = query.eq('variacao_id', variacaoId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Buscar produtos com estoque crítico
  const getEstoqueCritico = async (estabelecimentoId = null) => {
    let query = supabase
      .from('v_estoque_critico')
      .select('*')
      .order('deficit', { ascending: false })

    if (estabelecimentoId) {
      query = query.eq('estabelecimento_id', estabelecimentoId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Definir estoque mínimo para uma variação em um estabelecimento
  const setEstoqueMinimo = async (estabelecimentoId, variacaoId, quantidadeMinima) => {
    const { data, error } = await supabase
      .from(table_estoque_estabelecimento)
      .upsert({
        estabelecimento_id: estabelecimentoId,
        variacao_id: variacaoId,
        quantidade_minima: quantidadeMinima,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // =====================================================
  // UPLOAD DE IMAGENS
  // =====================================================
  const uploadProductImages = async (files) => {
    const fileArray = Array.isArray(files) ? files : Array.from(files || [])
    if (fileArray.length === 0) return { directoryId: null, uploadedResults: [], errors: [] }

    const directoryId = uuidv4()
    const uploadedResults = []
    const errors = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]

      if (
        !file ||
        !(file instanceof File || (file.constructor && file.constructor.name === 'File'))
      ) {
        errors.push({
          index: i,
          file: file?.name || `item_${i}`,
          message: 'Item não é um File válido',
        })
        continue
      }

      const fileExt = (file.name.split('.').pop() || 'bin').replace(/[^a-z0-9]/gi, '')
      const fileName = `${i}.${fileExt}`
      const filePath = `${directoryId}/${fileName}`

      const { error } = await supabase.storage
        .from('products_image')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (error) {
        errors.push({ file: file.name, message: error.message || 'Erro no upload', details: error })
        continue
      }

      const { data: urlData } = supabase.storage.from('products_image').getPublicUrl(filePath)
      uploadedResults.push({ file: file.name, path: filePath, url: urlData?.publicUrl || null })
    }

    return { directoryId, uploadedResults, errors }
  }

  const getProductImages = async (path_imagens) => {
    if (!path_imagens) return []

    const { data: files, error } = await supabase.storage
      .from('products_image')
      .list(path_imagens, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })

    if (error) {
      negativeNotify(`Erro ao listar imagens: ${error.message}`)
      return []
    }

    if (!files || files.length === 0) return []

    const sortedFiles = files.sort((a, b) => {
      const numA = parseInt(a.name.split('.')[0])
      const numB = parseInt(b.name.split('.')[0])
      return numA - numB
    })

    const imageUrls = sortedFiles.map((file) => {
      const filePath = `${path_imagens}/${file.name}`
      const { data } = supabase.storage.from('products_image').getPublicUrl(filePath)
      return data.publicUrl
    })

    return imageUrls
  }

  // =====================================================
  // PRODUTOS PARA LOJA (E-COMMERCE)
  // =====================================================
  const getProdutosParaLoja = async (categoriaNome = null, estabelecimentoId = null) => {
    try {
      // Se não especificar estabelecimento, usa estoque consolidado
      const tabelaEstoque = estabelecimentoId ? 'v_estoque_detalhado' : 'v_estoque_consolidado'

      let query = supabase
        .from(tabelaEstoque)
        .select('*')
        .gt(estabelecimentoId ? 'quantidade' : 'estoque_total', 0)

      if (estabelecimentoId) {
        query = query.eq('estabelecimento_id', estabelecimentoId)
      }

      if (categoriaNome) {
        query = query.ilike('categoria_nome', `%${categoriaNome}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Formata os dados para o formato esperado pela loja
      const produtosFormatados = await Promise.all(
        data.map(async (item) => {
          const imageUrls = await getProductImages(item.path_imagens)

          return {
            id: item.variacao_id,
            productName:
              `${item.produto_nome} ${item.btus ? '- ' + item.btus + ' BTUs' : ''} ${item.voltagem || ''} ${item.tipo ? '- ' + item.tipo : ''}`.trim(),
            imagePath: imageUrls[0] || '/placeholder.png',
            images: imageUrls,
            price: item.preco,
            discount: item.desconto_a_vista || 0,
            quota: 12,
            voltagem: item.voltagem,
            tipo: item.tipo,
            btus: item.btus,
            garantia: item.garantia,
            estoque: estabelecimentoId ? item.quantidade : item.estoque_total,
            marca: item.marca_nome,
            categoria: item.categoria_nome,
            subcategoria: item.subcategoria_nome,
            descricao: item.variacao_descricao,
          }
        }),
      )

      return produtosFormatados
    } catch (error) {
      negativeNotify(`Erro ao carregar produtos: ${error.message}`)
      return []
    }
  }

  const getProdutosArCondicionado = async (estabelecimentoId = null) => {
    return await getProdutosParaLoja('ar-condicionado', estabelecimentoId)
  }

  const getProdutosVentiladores = async (estabelecimentoId = null) => {
    return await getProdutosParaLoja('ventilador', estabelecimentoId)
  }

  const getVariacaoPorId = async (variacaoId) => {
    try {
      const { data, error } = await supabase
        .from(table_produto_variacao)
        .select(
          `
        *,
        produto:produto_id(
          id,
          nome,
          path_imagens,
          marca:marca_id(nome),
          categoria:categoria_id(nome),
          subcategoria:subcategoria_id(nome)
        )
      `,
        )
        .eq('id', variacaoId)
        .single()

      if (error) throw error

      const imageUrls = await getProductImages(data.produto.path_imagens)

      // Busca estoque consolidado
      const { data: estoqueData } = await supabase
        .from('v_estoque_consolidado')
        .select('estoque_total')
        .eq('variacao_id', variacaoId)
        .single()

      return {
        id: data.id,
        productName: `${data.produto.nome} ${data.btus ? '- ' + data.btus + ' BTUs' : ''} ${data.voltagem}`,
        imagePath: imageUrls[0] || '/placeholder.png',
        images: imageUrls,
        price: data.preco,
        discount: data.desconto_a_vista || 0,
        quota: 12,
        voltagem: data.voltagem,
        tipo: data.tipo,
        btus: data.btus,
        garantia: data.garantia,
        estoque: estoqueData?.estoque_total || 0,
        descricao: data.descricao,
        marca: data.produto.marca?.nome,
        categoria: data.produto.categoria?.nome,
        subcategoria: data.produto.subcategoria?.nome,
      }
    } catch (error) {
      negativeNotify(`Erro ao carregar produto: ${error.message}`)
      return null
    }
  }

  return {
    // Marcas
    addMarca,
    getMarcas,

    // Categorias
    addCategoria,
    getCategorias,

    // Subcategorias
    addSubcategoria,
    getSubcategorias,

    // Produtos
    addProduto,
    getProdutos,

    // Variações
    addProdutoVariacao,
    getProdutoVariacoes,

    // Estabelecimentos
    getEstabelecimentos,
    getEstabelecimentoById,
    getUserEstabelecimento, // EXPORTA PARA USAR NO FORMULÁRIO
    addEstabelecimento,
    updateEstabelecimento,

    // Estoque
    getEstoqueByEstabelecimento,
    getEstoqueConsolidado,
    getEstoqueByVariacao,
    ajustarEstoque,
    transferirEstoque,
    getMovimentacoes,
    getEstoqueCritico,
    setEstoqueMinimo,

    // Imagens
    uploadProductImages,
    getProductImages,

    // Loja
    getProdutosParaLoja,
    getProdutosArCondicionado,
    getProdutosVentiladores,
    getVariacaoPorId,
  }
}
