// import { ref } from "vue";
import useSupabase from '../boot/supabase'
import useAuthUser from './UseAuthUser'

export default function useAdressUser() {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()
  const table = 'endereco_usuario'

  const addAdress = async (form) => {
    //console.log(form)
    const { data, error } = await supabase.from(table).insert([
      {
        usuario_id: user.value.id,
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        endereco_padrao: form.endereco_padrao,
      },
    ])
    if (error) throw error
    return data
  }

  const getAdress = async () => {
    const { data, error } = await supabase.from(table).select('*').eq('usuario_id', user.value.id)
    if (error) throw error
    return data
  }

  const updateAdress = async (id, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({
        cep: form.cep,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        endereco_padrao: form.endereco_padrao,
      })
      .eq('id', id)
    if (error) throw error
    return data
  }

  const deleteAdress = async (id) => {
    const { data, error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
    return data
  }

  return { addAdress, getAdress, updateAdress, deleteAdress }
}
