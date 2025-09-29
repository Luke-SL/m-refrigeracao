import { ref, computed } from 'vue'
// import { ref, computed, readonly } from 'vue'
import useSupabase from 'src/boot/supabase'

// Estado global
const user = ref(null)
const loading = ref(true)

export default function useAuthUser() {
  const { supabase } = useSupabase()

  // Computed para isLoggedIn
  const isLoggedIn = computed(() => !!user.value)

  // Inicialização
  const initializeAuth = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      user.value = currentUser

      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user || null
      })
    } catch (error) {
      console.error('Erro na inicialização:', error)
    } finally {
      loading.value = false
    }
  }

  // Só inicializa se ainda não foi feito
  if (loading.value) {
    initializeAuth()
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

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    // Reseta o estado global do usuário
    user.value = null
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
          role: form.role,
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
          role: form.role,
        },
        emailRedirectTo: `${window.location.origin}/minha-pagina?fromEmail=registrationConfirmation`,
      },
    })
    if (error) throw error
    return data.user
  }

  const sendPasswordResetEmail = async (email) => {
    const { user, error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return user
  }

  const resetPassword = async (new_password) => {
    const { user, error } = await supabase.auth.updateUser({
      password: new_password,
    })
    if (error) throw error
    user
  }

  const updatePessoaFisico = async (form) => {
    //console.log(form)

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
    //console.log(form)
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
    //user: readonly(user),
    user,
    loading,
    isLoggedIn,
    login,
    logout,
    loginWithSocialProvider,
    registerPessoaFisica,
    registerPessoaJuridica,
    sendPasswordResetEmail,
    resetPassword,
    updatePessoaFisico,
    updatePessoaJuridica,
  }
}
