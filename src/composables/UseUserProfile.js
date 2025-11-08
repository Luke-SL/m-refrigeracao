// src/composables/UseUserProfile.js
import { ref, computed } from 'vue'
import useSupabase from 'src/boot/supabase'
import useAuthUser from 'src/composables/UseAuthUser'

const profile = ref(null)
const loadingProfile = ref(false)

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
    return profile.value?.celular || null
  })

  const celularFormatado = computed(() => {
    if (!profile.value?.celular) return null
    const c = profile.value.celular
    if (c.length !== 11) return c
    return `(${c.slice(0, 2)}) ${c.slice(2, 7)}-${c.slice(7)}`
  })

  /**
   * Busca o perfil do usuário atual
   */
  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null
      return null
    }

    try {
      loadingProfile.value = true

      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        throw error
      }

      profile.value = data
      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      profile.value = null
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
   * Limpa o perfil (logout)
   */
  const clearProfile = () => {
    profile.value = null
  }

  return {
    profile,
    loadingProfile,
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
    clearProfile,
  }
}
