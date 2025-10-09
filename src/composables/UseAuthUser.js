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

      // ⬅️ CORREÇÃO: Não buscar cargo em TODOS os eventos
      supabase.auth.onAuthStateChange(async (event, session) => {
        const previousUserId = user.value?.id
        user.value = session?.user || null

        // ⬅️ Só buscar cargo se o USUÁRIO mudou (login/logout)
        // NÃO buscar em eventos como USER_UPDATED (que é o update de perfil)
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user && session.user.id !== previousUserId) {
            await fetchUserCargo(session.user.id)
          }
        } else if (event === 'SIGNED_OUT') {
          cargo.value = null
        }
        // USER_UPDATED não faz nada com o cargo
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

  const registerPessoaFisica = async (form) => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        data: {
          celular: form.celular,
          data_nascimento: form.dataNascimento,
          documento: form.documento,
          primeiro_nome: form.nome,
          sobrenome: form.sobrenome,
          tipo_pessoa: form.tipoPessoa,
        },
        emailRedirectTo: `${window.location.origin}/minha-pagina?fromEmail=registrationConfirmation`,
      },
    })
    if (error) throw error
    return data.user
  }

  const registerPessoaJuridica = async (form) => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        data: {
          celular: form.celular,
          nome_fantasia: form.nomeFantasia,
          razao_social: form.razaoSocial,
          documento: form.documento,
          primeiro_nome: form.nome,
          sobrenome: form.sobrenome,
          tipo_pessoa: form.tipoPessoa,
        },
        emailRedirectTo: `${window.location.origin}/minha-pagina?fromEmail=registrationConfirmation`,
      },
    })
    if (error) throw error
    return data.user
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

  const updatePessoaFisico = async (form) => {
    const { data, error } = await supabase.auth.updateUser({
      email: form.email,
      data: {
        primeiro_nome: form.primeiro_nome,
        sobrenome: form.sobrenome,
        tipo_pessoa: 'fisica',
        documento: form.documento,
        data_nascimento: form.data_nascimento,
        celular: form.celular,
        nome_fantasia: null,
        razao_social: null,
      },
    })
    if (error) throw error

    user.value = data.user
    return data.user
  }

  const updatePessoaJuridica = async (form) => {
    const { data, error } = await supabase.auth.updateUser({
      email: form.email,
      options: {
        // ⬅️ MANTÉM options como estava
        data: {
          primeiro_nome: form.primeiro_nome,
          sobrenome: form.sobrenome,
          tipo_pessoa: 'juridica',
          nome_fantasia: form.nome_fantasia,
          razao_social: form.razao_social,
          documento: form.documento,
          celular: form.celular,
          data_nascimento: null,
        },
      },
    })
    if (error) throw error

    user.value = data.user
    return data.user
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
    registerPessoaFisica,
    registerPessoaJuridica,
    sendPasswordResetEmail,
    resetPassword,
    updatePessoaFisico,
    updatePessoaJuridica,
    hasCargo,
    hasAnyCargo,
    getUserCargo,
    refreshUser,
  }
}
