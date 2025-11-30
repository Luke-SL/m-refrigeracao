// src/composables/UseUserProfile.js
import { ref, computed } from 'vue'
import useSupabase from 'src/boot/supabase'
import useAuthUser from 'src/composables/UseAuthUser'

const profile = ref(null)
const loadingProfile = ref(false)
const telefonePrincipal = ref(null)

export default function useUserProfile() {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()

  const hasProfile = computed(() => !!profile.value)

  const isEmailConfirmed = computed(() => {
    return user.value?.email_confirmed_at != null
  })

  const tipoPessoa = computed(() => {
    return profile.value?.tipo_cliente || null
  })

  const isPessoaFisica = computed(() => {
    return profile.value?.tipo_cliente === 'pessoa_fisica'
  })

  const isPessoaJuridica = computed(() => {
    return profile.value?.tipo_cliente === 'pessoa_juridica'
  })

  const nomeCompleto = computed(() => {
    if (!profile.value) return ''
    return `${profile.value.nome} ${profile.value.sobrenome}`.trim()
  })

  const documento = computed(() => {
    if (!profile.value) return null
    return profile.value.cpf || profile.value.cnpj
  })

  const celular = computed(() => {
    if (!telefonePrincipal.value) return null
    return `${telefonePrincipal.value.ddd}${telefonePrincipal.value.numero}`
  })

  const celularFormatado = computed(() => {
    if (!telefonePrincipal.value) return null
    const ddd = telefonePrincipal.value.ddd
    const num = telefonePrincipal.value.numero
    if (num.length === 9) {
      // Celular: (XX) XXXXX-XXXX
      return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`
    } else if (num.length === 8) {
      // Fixo: (XX) XXXX-XXXX
      return `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`
    }
    return `(${ddd}) ${num}`
  })

  /**
   * Busca o perfil do usuário atual
   */
  const fetchProfile = async () => {
    if (!user.value) {
      console.warn('fetchProfile: Usuário não autenticado')
      profile.value = null
      telefonePrincipal.value = null
      return null
    }

    try {
      loadingProfile.value = true

      // Buscar perfil
      const { data: profileData, error: profileError } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('id', user.value.id)
        .single()

      // PGRST116 = nenhum resultado encontrado
      if (profileError && profileError.code === 'PGRST116') {
        console.warn('fetchProfile: Perfil não encontrado para usuário:', user.value.id)
        profile.value = null
        telefonePrincipal.value = null
        return null
      }

      if (profileError) {
        console.error('fetchProfile: Erro ao buscar perfil:', profileError)
        throw profileError
      }

      profile.value = profileData

      // Buscar telefone principal
      const { data: telefoneData, error: telefoneError } = await supabase
        .from('telefone_usuario')
        .select('*')
        .eq('usuario_id', user.value.id)
        .eq('principal', true)
        .single()

      // PGRST116 = nenhum resultado encontrado (não é erro - usuário pode não ter telefone)
      if (telefoneError && telefoneError.code !== 'PGRST116') {
        console.error('fetchProfile: Erro ao buscar telefone:', telefoneError)
        // Não lançar erro - telefone é opcional
      }

      telefonePrincipal.value = telefoneData || null

      return profileData
    } catch (error) {
      console.error('fetchProfile: Erro geral:', error)
      profile.value = null
      telefonePrincipal.value = null
      return null
    } finally {
      loadingProfile.value = false
    }
  }

  /**
   * Atualiza o perfil do usuário
   */
  const updateProfile = async (updates) => {
    if (!user.value) {
      throw new Error('Usuário não autenticado')
    }

    try {
      loadingProfile.value = true

      const { data, error } = await supabase
        .from('perfil_usuario')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error

      profile.value = data
      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    } finally {
      loadingProfile.value = false
    }
  }

  /**
   * Atualiza a cor do avatar
   */
  const updateAvatarColor = async (color) => {
    return updateProfile({ avatar_cor: color })
  }

  /**
   * Atualiza ou cria telefone principal
   */
  const updateTelefonePrincipal = async (celular) => {
    if (!user.value) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const celularLimpo = celular.replace(/\D/g, '')
      const ddd = celularLimpo.substring(0, 2)
      const numero = celularLimpo.substring(2)

      if (telefonePrincipal.value) {
        // Atualizar telefone existente
        const { data, error } = await supabase
          .from('telefone_usuario')
          .update({
            ddd: ddd,
            numero: numero,
            tipo: 'celular',
          })
          .eq('id', telefonePrincipal.value.id)
          .select()
          .single()

        if (error) throw error
        telefonePrincipal.value = data
      } else {
        // Criar novo telefone
        const { data, error } = await supabase
          .from('telefone_usuario')
          .insert({
            usuario_id: user.value.id,
            ddd: ddd,
            numero: numero,
            tipo: 'celular',
            principal: true,
            verificado: false,
          })
          .select()
          .single()

        if (error) throw error
        telefonePrincipal.value = data
      }

      return telefonePrincipal.value
    } catch (error) {
      console.error('Erro ao atualizar telefone:', error)
      throw error
    }
  }

  /**
   * Busca todos os telefones do usuário
   */
  const fetchTelefones = async () => {
    if (!user.value) return []

    try {
      const { data, error } = await supabase
        .from('telefone_usuario')
        .select('*')
        .eq('usuario_id', user.value.id)
        .order('principal', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar telefones:', error)
      return []
    }
  }

  /**
   * Limpa o perfil (logout)
   */
  const clearProfile = () => {
    profile.value = null
    telefonePrincipal.value = null
  }

  return {
    profile,
    loadingProfile,
    telefonePrincipal,
    hasProfile,
    isEmailConfirmed,
    tipoPessoa,
    isPessoaFisica,
    isPessoaJuridica,
    nomeCompleto,
    documento,
    celular,
    celularFormatado,
    fetchProfile,
    updateProfile,
    updateAvatarColor,
    updateTelefonePrincipal,
    fetchTelefones,
    clearProfile,
  }
}
