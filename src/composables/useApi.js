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

  // Adicionar e buscar produtos
  const addProduto = async (form) => {
    const { data, error } = await supabase
      .from(table_produto)
      .insert([
        {
          nome: form.nome,
          descricao: form.descricao,
          categoria_id: form.categoria_id,
          marca_id: form.marca_id,
          usuario_id: user.value.id,
          path_imagens: form.path_imagens,
        },
      ])
      .select('id')

    if (error) {
      console.error('Erro ao inserir produto:', error)
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
      console.error(err)
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
        console.error('Erro no upload do arquivo', file.name, error)
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

  return {
    addMarca,
    getMarcas,
    addCategoria,
    getCategorias,
    addProduto,
    getProdutos,
    addProdutoVariacao,
    getProdutoVariacoes,
    uploadProductImages,
    getProductImages,
  }
}
