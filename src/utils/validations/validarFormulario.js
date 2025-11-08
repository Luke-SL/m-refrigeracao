// src/utils/validations/validarFormulario.js

const validarFormulario = async (form) => {
  // ---- Campos básicos ----
  if (!form.nome || typeof form.nome !== 'string')
    return { isValid: false, message: 'Nome inválido' }
  form.nome = form.nome.trim()
  if (form.nome.length < 2) return { isValid: false, message: 'Nome muito curto' }
  if (form.nome.length > 100) return { isValid: false, message: 'Nome muito longo' }

  if (!form.sobrenome || typeof form.sobrenome !== 'string')
    return { isValid: false, message: 'Sobrenome inválido' }
  form.sobrenome = form.sobrenome.trim()
  if (form.sobrenome.length < 2) return { isValid: false, message: 'Sobrenome muito curto' }
  if (form.sobrenome.length > 100) return { isValid: false, message: 'Sobrenome muito longo' }

  // ---- Tipo de pessoa ----
  if (!form.tipoPessoa || !['fisica', 'juridica'].includes(form.tipoPessoa.toLowerCase()))
    return { isValid: false, message: 'Tipo de pessoa inválido' }

  // ---- Pessoa Física ----
  if (form.tipoPessoa === 'fisica') {
    if (!form.dataNascimento) return { isValid: false, message: 'Data de nascimento é obrigatória' }

    const data = new Date(form.dataNascimento)
    if (isNaN(data.getTime())) return { isValid: false, message: 'Data de nascimento inválida' }
    if (data >= new Date())
      return { isValid: false, message: 'Data de nascimento deve ser no passado' }
  }

  // ---- Pessoa Jurídica ----
  if (form.tipoPessoa === 'juridica') {
    if (!form.nomeFantasia?.trim())
      return { isValid: false, message: 'Nome fantasia é obrigatório' }
    if (!form.razaoSocial?.trim()) return { isValid: false, message: 'Razão social é obrigatória' }
    if (!form.inscricaoEstadual?.trim())
      return { isValid: false, message: 'Inscrição estadual é obrigatória' }

    form.nomeFantasia = form.nomeFantasia.trim()
    form.razaoSocial = form.razaoSocial.trim()
    form.inscricaoEstadual = form.inscricaoEstadual.trim()
  }

  // ---- Documento ----
  if (!form.documento)
    return {
      isValid: false,
      message: form.tipoPessoa === 'juridica' ? 'CNPJ é obrigatório' : 'CPF é obrigatório',
    }
  const documentoLimpo = form.documento.replace(/\D/g, '')
  if (form.tipoPessoa === 'juridica' && documentoLimpo.length !== 14)
    return { isValid: false, message: 'CNPJ deve ter 14 dígitos' }
  if (form.tipoPessoa === 'fisica' && documentoLimpo.length !== 11)
    return { isValid: false, message: 'CPF deve ter 11 dígitos' }
  form.documento = documentoLimpo

  // ---- Celular ----
  if (!form.celular) return { isValid: false, message: 'Celular é obrigatório' }
  form.celular = form.celular.replace(/\D/g, '')
  if (form.celular.length !== 11) return { isValid: false, message: 'Celular deve ter 11 dígitos' }

  // ---- Email ----
  if (!form.email) return { isValid: false, message: 'E-mail é obrigatório' }
  form.email = form.email.trim().toLowerCase()
  if (!/.+@.+\..+/.test(form.email)) return { isValid: false, message: 'E-mail inválido' }

  // ---- Senha ----
  if (!form.senha) return { isValid: false, message: 'Senha é obrigatória' }
  if (form.senha.length < 8)
    return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' }
  if (form.senha !== form.senha.trim())
    return { isValid: false, message: 'Senha não pode ter espaços no início ou fim' }
  if (form.senha !== form.confirmacaoSenha)
    return { isValid: false, message: 'Senhas não conferem' }

  // ---- Normalização final ----
  delete form.confirmacaoSenha

  return { isValid: true, form }
}

export { validarFormulario }
