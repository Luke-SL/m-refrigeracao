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
        .single()

      if (!error && data) {
        cargo.value = data.cargo
      } else {
        cargo.value = null
      }
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
   * Segura: não expõe dados sensíveis no JWT
   */
  // src/composables/UseAuthUser.js

  // src/composables/UseAuthUser.js

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

      // 2. Preparar parâmetros para a function
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
        p_celular: form.celular || null, // ⬅️ ADICIONAR CELULAR
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

      // 2. Atualizar dados no perfil_usuario
      const updateData = {
        nome: form.primeiro_nome || form.nome,
        sobrenome: form.sobrenome,
        cpf: form.documento,
        data_nascimento: form.data_nascimento,
        celular: form.celular || null, // ⬅️ ADICIONAR CELULAR
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

      // 3. Atualizar user state local
      await refreshUser()

      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  /**
   * Atualiza perfil de Pessoa Jurídica
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

      // 2. Atualizar dados no perfil_usuario
      const updateData = {
        nome: form.primeiro_nome || form.nome,
        sobrenome: form.sobrenome,
        cnpj: form.documento,
        razao_social: form.razao_social,
        inscricao_estadual: form.inscricao_estadual,
        celular: form.celular || null, // ⬅️ ADICIONAR CELULAR
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

      // 3. Atualizar user state local
      await refreshUser()

      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  /**
   * Obtém o perfil completo do usuário atual
   */
  const getUserProfile = async () => {
    const currentUser = user.value
    if (!currentUser) return null

    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
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
    updatePessoaFisico, // ✅ Atualizado para usar perfil_usuario
    updatePessoaJuridica, // ✅ Atualizado para usar perfil_usuario
    getUserProfile, // ✅ Nova função
    updateProfile, // ✅ Nova função
    hasCargo,
    hasAnyCargo,
    getUserCargo,
    refreshUser,
  }
}
