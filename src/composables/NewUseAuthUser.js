// src/composables/UseAuthUser.js
import { ref, computed } from 'vue'
import useSupabase from 'src/boot/supabase'

const user = ref(null)
const loading = ref(true)
const cargo = ref(null) // ⬅️ NOVO

export default function useAuthUser() {
  const { supabase } = useSupabase()

  const isLoggedIn = computed(() => !!user.value)

  // ⬅️ NOVO: Computed para verificar se é admin (CEO ou Gerente)
  const isAdmin = computed(() => {
    return cargo.value && ['ceo', 'gerente'].includes(cargo.value)
  })

  // ⬅️ NOVO: Computed para verificar cargo específico
  const hasCargo = (cargos) => {
    if (!cargo.value) return false
    const cargosArray = Array.isArray(cargos) ? cargos : [cargos]
    return cargosArray.includes(cargo.value)
  }

  // ⬅️ ATUALIZADO: Buscar cargo junto com o usuário
  const getUser = async () => {
    loading.value = true
    try {
      const {
        data: { user: userData },
        error,
      } = await supabase.auth.getUser()

      if (error) throw error

      user.value = userData

      // Buscar cargo do usuário na tabela time_comercio
      if (userData) {
        const { data: cargoData, error: cargoError } = await supabase
          .from('time_comercio')
          .select('cargo')
          .eq('usuario_id', userData.id)
          .single()

        if (!cargoError && cargoData) {
          cargo.value = cargoData.cargo
        } else {
          cargo.value = null // Usuário não faz parte da equipe
        }
      } else {
        cargo.value = null
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      user.value = null
      cargo.value = null
    } finally {
      loading.value = false
    }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    // Atualiza o estado global do usuário
    user.value = data.user

    return data.user
  }

  const loginWithSocialProvider = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider })
    if (error) throw error
    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    user.value = null
    cargo.value = null // ⬅️ Limpar cargo
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

  const resetPassword = async (accessToken, newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
    return data
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

    // Atualiza o estado global do usuário
    user.value = data.user

    return data.user
  }

  const updatePessoaJuridica = async (form) => {
    const { data, error } = await supabase.auth.updateUser({
      email: form.email,
      options: {
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

    // Atualiza o estado global do usuário
    user.value = data.user

    return data.user
  }

  return {
    user,
    loading,
    cargo, // ⬅️ NOVO
    isLoggedIn,
    isAdmin, // ⬅️ NOVO
    hasCargo, // ⬅️ NOVO
    getUser,
    login,
    loginWithSocialProvider,
    logout,
    registerPessoaFisica,
    registerPessoaJuridica,
    sendPasswordResetEmail,
    resetPassword,
    updatePessoaJuridica,
    updatePessoaFisico,
  }
}
