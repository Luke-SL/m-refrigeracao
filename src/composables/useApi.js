// src/composables/useApi.js
// image/jpeg, image/png, image/webp

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

  // Adição e Busca de marcas
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

  // Adição e Busca de categorias
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

  // Adição e busca de subcategorias
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

  // Adicionar e buscar produtos
  const addProduto = async (form) => {
    const { data, error } = await supabase
      .from(table_produto)
      .insert([
        {
          nome: form.nome,
          descricao: form.descricao,
          categoria_id: form.categoria_id,
          subcategoria_id: form.subcategoria_id,
          marca_id: form.marca_id,
          usuario_id: user.value.id,
          path_imagens: form.path_imagens,

          // Campos para Ventilador
          peso_liquido_kg: form.peso_liquido_kg,
          peso_bruto_kg: form.peso_bruto_kg,
          largura_cm: form.largura_cm,
          altura_cm: form.altura_cm,
          profundidade_cm: form.profundidade_cm,
          largura_embalado_cm: form.largura_embalado_cm,
          altura_embalado_cm: form.altura_embalado_cm,
          profundidade_embalado_cm: form.profundidade_embalado_cm,

          // Campos para Ar-condicionado - Unidade Interna
          peso_liquido_interno_kg: form.peso_liquido_interno_kg,
          peso_bruto_interno_kg: form.peso_bruto_interno_kg,
          largura_interno_cm: form.largura_interno_cm,
          altura_interno_cm: form.altura_interno_cm,
          profundidade_interno_cm: form.profundidade_interno_cm,
          largura_interno_embalado_cm: form.largura_interno_embalado_cm,
          altura_interno_embalado_cm: form.altura_interno_embalado_cm,
          profundidade_interno_embalado_cm: form.profundidade_interno_embalado_cm,

          // Campos para Ar-condicionado - Unidade Externa
          peso_liquido_externo_kg: form.peso_liquido_externo_kg,
          peso_bruto_externo_kg: form.peso_bruto_externo_kg,
          largura_externo_cm: form.largura_externo_cm,
          altura_externo_cm: form.altura_externo_cm,
          profundidade_externo_cm: form.profundidade_externo_cm,
          largura_externo_embalado_cm: form.largura_externo_embalado_cm,
          altura_externo_embalado_cm: form.altura_externo_embalado_cm,
          profundidade_externo_embalado_cm: form.profundidade_externo_embalado_cm,
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
        marca:marca_id(nome)
      `,
      )
      .order('nome', { ascending: true })

    if (error) throw error
    return data
  }

  // Adicionar e buscar variações de produtos
  const addProdutoVariacao = async (form) => {
    try {
      const { error } = await supabase.from(table_produto_variacao).insert([
        {
          produto_id: form.produto_id,
          usuario_id: user.value.id,
          voltagem: form.voltagem,
          tipo: form.tipo,
          btus: form.btus || null,
          garantia: form.garantia,
          preco: form.preco,
          estoque: form.estoque,
          desconto_a_vista: form.desconto_a_vista || 0,
          peso_liquido: form.peso_liquido,
          peso_bruto: form.peso_bruto,
          largura: form.largura,
          altura: form.altura,
          profundidade: form.profundidade,
          // ficha_tecnica_url: form.ficha_tecnica_url || null,
        },
      ])

      if (error) throw error

      positiveNotify('Variação adicionada com sucesso!')
    } catch (err) {
      negativeNotify(`Erro ao adicionar variação: ${err.message}`)
    }
  }

  const getProdutoVariacoes = async (produtoId = null) => {
    let query = supabase
      .from(table_produto_variacao)
      .select(
        `
        *,
        produto:produto_id(nome, marca_id, categoria_id)
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

  // Upload e busca de imagens
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

  // ============================================
  // ADICIONE ESTAS FUNÇÕES NO SEU useApi.js
  // (mantendo todas as funções existentes)
  // ============================================

  // Buscar produtos com variações para a loja (filtrado por categoria)
  const getProdutosParaLoja = async (categoriaNome = null) => {
    try {
      let query = supabase
        .from(table_produto_variacao)
        .select(
          `
        id,
        voltagem,
        tipo,
        btus,
        preco,
        estoque,
        desconto_a_vista,
        garantia,
        produto:produto_id(
          id,
          nome,
          descricao,
          path_imagens,
          marca:marca_id(nome),
          categoria:categoria_id(id, nome)
        )
      `,
        )
        .gt('estoque', 0)
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error

      // Filtra por categoria se fornecido
      let filteredData = data
      if (categoriaNome) {
        filteredData = data.filter((variacao) => {
          const categoriaProduto = variacao.produto?.categoria?.nome?.toLowerCase()
          return categoriaProduto && categoriaProduto.includes(categoriaNome.toLowerCase())
        })
      }

      // Formata os dados
      const produtosFormatados = await Promise.all(
        filteredData.map(async (variacao) => {
          const imageUrls = await getProductImages(variacao.produto.path_imagens)

          return {
            id: variacao.id, // ID da variação
            productName:
              `${variacao.produto.nome} - ${variacao.btus ? variacao.btus + ' BTUs' : ''} ${variacao.voltagem} ${variacao.tipo ? ' - ' + variacao.tipo : ''}`.trim(),
            imagePath: imageUrls[0] || '/placeholder.png',
            images: imageUrls,
            price: variacao.preco,
            discount: variacao.desconto_a_vista || 0,
            quota: 12,

            // Dados da variação
            voltagem: variacao.voltagem,
            tipo: variacao.tipo,
            btus: variacao.btus,
            garantia: variacao.garantia,
            estoque: variacao.estoque,

            // Dados do produto
            descricao: variacao.produto.descricao,
            marca: variacao.produto.marca?.nome,
            categoria: variacao.produto.categoria?.nome,
          }
        }),
      )

      return produtosFormatados
    } catch (error) {
      negativeNotify(`Erro ao carregar produtos: ${error.message}`)
      return []
    }
  }

  // Buscar produtos de Ar-Condicionado
  const getProdutosArCondicionado = async () => {
    return await getProdutosParaLoja('ar-condicionado')
  }

  // Buscar produtos Ventiladores
  const getProdutosVentiladores = async () => {
    return await getProdutosParaLoja('ventilador')
  }

  // Buscar uma variação específica pelo ID
  const getVariacaoPorId = async (variacaoId) => {
    try {
      const { data, error } = await supabase
        .from(table_produto_variacao)
        .select(
          `
        id,
        voltagem,
        tipo,
        btus,
        preco,
        estoque,
        desconto_a_vista,
        garantia,
        peso_liquido,
        peso_bruto,
        largura,
        altura,
        profundidade,
        produto:produto_id(
          id,
          nome,
          descricao,
          path_imagens,
          marca:marca_id(nome),
          categoria:categoria_id(id, nome)
        )
      `,
        )
        .eq('id', variacaoId)
        .single()

      if (error) throw error

      const imageUrls = await getProductImages(data.produto.path_imagens)

      return {
        id: data.id,
        productName: `${data.produto.nome} - ${data.btus ? data.btus + ' BTUs' : ''} ${data.voltagem} `,
        imagePath: imageUrls[0] || '/placeholder.png',
        images: imageUrls,
        price: data.preco,
        discount: data.desconto_a_vista || 0,
        quota: 12,

        voltagem: data.voltagem,
        tipo: data.tipo,
        btus: data.btus,
        garantia: data.garantia,
        estoque: data.estoque,

        descricao: data.produto.descricao,
        marca: data.produto.marca?.nome,
        categoria: data.produto.categoria?.nome,

        peso_liquido: data.peso_liquido,
        peso_bruto: data.peso_bruto,
        largura: data.largura,
        altura: data.altura,
        profundidade: data.profundidade,
      }
    } catch (error) {
      negativeNotify(`Erro ao carregar produto: ${error.message}`)
      return null
    }
  }

  return {
    addMarca,
    getMarcas,
    addCategoria,
    getCategorias,
    addSubcategoria,
    getSubcategorias,
    addProduto,
    getProdutos,
    addProdutoVariacao,
    getProdutoVariacoes,
    uploadProductImages,
    getProductImages,
    // NOVAS FUNÇÕES PARA A LOJA:
    getProdutosParaLoja,
    getProdutosArCondicionado,
    getProdutosVentiladores,
    getVariacaoPorId,
  }
}
