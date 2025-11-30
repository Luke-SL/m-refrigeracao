// src/composables/UseAuthUser.js
import { ref, computed } from 'vue'
import useSupabase from 'src/boot/supabase'

// Estado global
const user = ref(null)
const loading = ref(true)
const cargo = ref(null)
let authInitialized = false

export default function useAuthUser() {
  const { supabase } = useSupabase()

  const isLoggedIn = computed(() => !!user.value)

  const isAdmin = computed(() => {
    return cargo.value && ['ceo', 'gerente'].includes(cargo.value)
  })

  const fetchUserCargo = async (userId) => {
    if (!userId) {
      cargo.value = null
      return
    }

    try {
      const { data, error } = await supabase
        .from('time_comercio')
        .select('cargo')
        .eq('usuario_id', userId)
        .eq('ativo', true)
        .maybeSingle() // ✅ Mudança aqui: use maybeSingle() ao invés de single()

      if (error) {
        // Só logar erros que NÃO sejam "não encontrado"
        if (error.code !== 'PGRST116') {
          console.error('Erro ao buscar cargo:', error)
        }
        cargo.value = null
        return
      }

      // Se encontrou dados, atribui o cargo
      cargo.value = data?.cargo || null
    } catch (error) {
      console.error('Erro ao buscar cargo:', error)
      cargo.value = null
    }
  }

  const initializeAuth = async () => {
    if (authInitialized) return

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      user.value = currentUser

      if (currentUser) {
        await fetchUserCargo(currentUser.id)
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        const previousUserId = user.value?.id
        user.value = session?.user || null

        // Só buscar cargo se o USUÁRIO mudou (login/logout)
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user && session.user.id !== previousUserId) {
            await fetchUserCargo(session.user.id)
          }
        } else if (event === 'SIGNED_OUT') {
          cargo.value = null
        }
      })

      authInitialized = true
    } catch (error) {
      console.error('Erro na inicialização:', error)

      // Se erro 403 ou usuário inválido, limpar sessão
      if (error?.status === 403 || error?.message?.includes('invalid')) {
        console.warn('⚠️ Sessão inválida detectada. Limpando...')

        // Limpar tokens do Supabase
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key)
          }
        })

        user.value = null
        cargo.value = null
      }
    } finally {
      loading.value = false
    }
  }

  if (loading.value && !authInitialized) {
    initializeAuth()
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    user.value = data.user
    await fetchUserCargo(data.user.id)

    return data.user
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    user.value = null
    cargo.value = null
  }

  const loginWithSocialProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    })
    if (error) throw error
    return data.user
  }

  /**
   * NOVA FUNÇÃO UNIFICADA DE REGISTRO
   * Atualizada para trabalhar com telefone_usuario
   */
  const register = async (form) => {
    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation?fromEmail=registrationConfirmation`,
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      console.log('✅ Usuário criado no Auth:', authData.user.id)

      // 2. Preparar parâmetros para a function (SEM celular)
      const params = {
        p_id: authData.user.id,
        p_nome: form.nome,
        p_sobrenome: form.sobrenome,
        p_tipo_cliente: form.tipoPessoa === 'fisica' ? 'pessoa_fisica' : 'pessoa_juridica',
        p_cpf: form.tipoPessoa === 'fisica' ? form.documento : null,
        p_cnpj: form.tipoPessoa === 'juridica' ? form.documento : null,
        p_data_nascimento: form.tipoPessoa === 'fisica' ? form.dataNascimento : null,
        p_razao_social: form.tipoPessoa === 'juridica' ? form.razaoSocial : null,
        p_inscricao_estadual: form.tipoPessoa === 'juridica' ? form.inscricaoEstadual : null,
      }

      console.log('📦 Chamando function create_perfil_usuario:', params)

      // 3. Chamar a function que bypassa RLS
      const { data: profileData, error: profileError } = await supabase.rpc(
        'create_perfil_usuario',
        params,
      )

      if (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError)
        throw new Error(`Erro ao criar perfil: ${profileError.message}`)
      }

      console.log('✅ Perfil criado com sucesso:', profileData)

      // 4. Adicionar telefone se fornecido
      if (form.celular) {
        const celularLimpo = form.celular.replace(/\D/g, '')
        const ddd = celularLimpo.substring(0, 2)
        const numero = celularLimpo.substring(2)

        const { error: telefoneError } = await supabase.from('telefone_usuario').insert({
          usuario_id: authData.user.id,
          ddd: ddd,
          numero: numero,
          tipo: 'celular',
          principal: true,
          verificado: false,
        })

        if (telefoneError) {
          console.error('⚠️ Erro ao adicionar telefone:', telefoneError)
          // Não lançar erro, apenas avisar
        } else {
          console.log('✅ Telefone cadastrado com sucesso')
        }
      }

      return authData.user
    } catch (error) {
      console.error('❌ Erro geral no registro:', error)
      throw error
    }
  }

  /**
   * DEPRECATED: Manter para compatibilidade
   * Use register() no lugar
   */
  const registerPessoaFisica = async (form) => {
    console.warn('registerPessoaFisica está deprecated. Use register() no lugar.')
    return register({ ...form, tipoPessoa: 'fisica' })
  }

  /**
   * DEPRECATED: Manter para compatibilidade
   * Use register() no lugar
   */
  const registerPessoaJuridica = async (form) => {
    console.warn('registerPessoaJuridica está deprecated. Use register() no lugar.')
    return register({ ...form, tipoPessoa: 'juridica' })
  }

  const sendPasswordResetEmail = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return data
  }

  const resetPassword = async (new_password) => {
    const { data, error } = await supabase.auth.updateUser({
      password: new_password,
    })
    if (error) throw error
    return data.user
  }

  /**
   * Atualiza perfil de Pessoa Física
   * Atualizado para trabalhar com telefone_usuario
   */
  const updatePessoaFisico = async (form) => {
    try {
      const currentUser = user.value
      if (!currentUser) throw new Error('Usuário não autenticado')

      // 1. Atualizar email no Auth (se mudou)
      if (form.email && form.email !== currentUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: form.email,
        })
        if (emailError) throw emailError
      }

      // 2. Atualizar dados no perfil_usuario (SEM celular)
      const updateData = {
        nome: form.primeiro_nome || form.nome,
        sobrenome: form.sobrenome,
        cpf: form.documento,
        data_nascimento: form.data_nascimento,
        tipo_cliente: 'pessoa_fisica',
        // Limpar campos de PJ
        cnpj: null,
        razao_social: null,
        inscricao_estadual: null,
      }

      const { data, error } = await supabase
        .from('perfil_usuario')
        .update(updateData)
        .eq('id', currentUser.id)
        .select()
        .single()

      if (error) throw error

      // 3. Atualizar telefone se fornecido
      if (form.celular) {
        await updateTelefonePrincipal(currentUser.id, form.celular)
      }

      // 4. Atualizar user state local
      await refreshUser()

      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  /**
   * Atualiza perfil de Pessoa Jurídica
   * Atualizado para trabalhar com telefone_usuario
   */
  const updatePessoaJuridica = async (form) => {
    try {
      const currentUser = user.value
      if (!currentUser) throw new Error('Usuário não autenticado')

      // 1. Atualizar email no Auth (se mudou)
      if (form.email && form.email !== currentUser.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: form.email,
        })
        if (emailError) throw emailError
      }

      // 2. Atualizar dados no perfil_usuario (SEM celular)
      const updateData = {
        nome: form.primeiro_nome || form.nome,
        sobrenome: form.sobrenome,
        cnpj: form.documento,
        razao_social: form.razao_social,
        inscricao_estadual: form.inscricao_estadual,
        tipo_cliente: 'pessoa_juridica',
        // Limpar campos de PF
        cpf: null,
        data_nascimento: null,
      }

      const { data, error } = await supabase
        .from('perfil_usuario')
        .update(updateData)
        .eq('id', currentUser.id)
        .select()
        .single()

      if (error) throw error

      // 3. Atualizar telefone se fornecido
      if (form.celular) {
        await updateTelefonePrincipal(currentUser.id, form.celular)
      }

      // 4. Atualizar user state local
      await refreshUser()

      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  /**
   * Atualiza ou cria telefone principal do usuário
   */
  const updateTelefonePrincipal = async (usuarioId, celular) => {
    try {
      const celularLimpo = celular.replace(/\D/g, '')
      const ddd = celularLimpo.substring(0, 2)
      const numero = celularLimpo.substring(2)

      // Buscar telefone principal existente
      const { data: telefoneExistente } = await supabase
        .from('telefone_usuario')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('principal', true)
        .single()

      if (telefoneExistente) {
        // Atualizar telefone existente
        const { error } = await supabase
          .from('telefone_usuario')
          .update({
            ddd: ddd,
            numero: numero,
            tipo: 'celular',
          })
          .eq('id', telefoneExistente.id)

        if (error) throw error
      } else {
        // Criar novo telefone
        const { error } = await supabase.from('telefone_usuario').insert({
          usuario_id: usuarioId,
          ddd: ddd,
          numero: numero,
          tipo: 'celular',
          principal: true,
          verificado: false,
        })

        if (error) throw error
      }
    } catch (error) {
      console.error('Erro ao atualizar telefone:', error)
      throw error
    }
  }

  /**
   * Obtém o perfil completo do usuário atual
   */
  const getUserProfile = async () => {
    const currentUser = user.value
    if (!currentUser) {
      console.warn('getUserProfile: Usuário não autenticado')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      // PGRST116 = nenhum resultado encontrado (não é erro crítico)
      if (error && error.code === 'PGRST116') {
        console.warn('getUserProfile: Perfil não encontrado para usuário:', currentUser.id)
        return null
      }

      if (error) {
        console.error('getUserProfile: Erro ao buscar perfil:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('getUserProfile: Erro ao buscar perfil:', error)
      return null
    }
  }

  /**
   * Atualiza campos específicos do perfil
   */
  const updateProfile = async (updates) => {
    const currentUser = user.value
    if (!currentUser) throw new Error('Usuário não autenticado')

    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .update(updates)
        .eq('id', currentUser.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  const hasCargo = (cargoVerificar) => {
    return cargo.value === cargoVerificar
  }

  const hasAnyCargo = (cargos) => {
    return cargo.value && cargos.includes(cargo.value)
  }

  const getUserCargo = () => {
    return cargo.value
  }

  const refreshUser = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      user.value = currentUser

      if (currentUser) {
        await fetchUserCargo(currentUser.id)
      } else {
        cargo.value = null
      }

      return currentUser
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      return null
    }
  }

  return {
    user,
    loading,
    cargo,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    loginWithSocialProvider,
    register, // ✅ Nova função unificada
    registerPessoaFisica, // Mantido para compatibilidade (deprecated)
    registerPessoaJuridica, // Mantido para compatibilidade (deprecated)
    sendPasswordResetEmail,
    resetPassword,
    updatePessoaFisico, // ✅ Atualizado para usar telefone_usuario
    updatePessoaJuridica, // ✅ Atualizado para usar telefone_usuario
    getUserProfile, // ✅ Nova função
    updateProfile, // ✅ Nova função
    updateTelefonePrincipal, // ✅ Nova função
    hasCargo,
    hasAnyCargo,
    getUserCargo,
    refreshUser,
  }
}
