const validarUpdateUsuario = async (form) => {
  // Normaliza os dados
  const formValidado = { ...form }
  if (typeof formValidado.tipoPessoa === 'string') {
    formValidado.tipoPessoa = formValidado.tipoPessoa.toLowerCase().trim()
  }

  // Nome
  if (typeof formValidado.nome !== 'string') {
    return { isValid: false, message: 'Nome inválido' }
  }
  formValidado.nome = formValidado.nome.trim()
  if (formValidado.nome.length < 2) {
    return { isValid: false, message: 'Nome muito curto' }
  }
  if (formValidado.nome.length > 100) {
    return { isValid: false, message: 'Nome muito longo' }
  }

  // Sobrenome
  if (typeof formValidado.sobrenome !== 'string') {
    return { isValid: false, message: 'Sobrenome inválido' }
  }
  formValidado.sobrenome = formValidado.sobrenome.trim()
  if (formValidado.sobrenome.length < 2) {
    return { isValid: false, message: 'Sobrenome muito curto' }
  }

  // Tipo de pessoa
  if (!['fisica', 'juridica'].includes(formValidado.tipoPessoa)) {
    return { isValid: false, message: 'Tipo de pessoa inválido' }
  }

  // Documento (remove máscara)
  if (typeof formValidado.documento !== 'string') {
    return { isValid: false, message: 'Documento inválido' }
  }
  const documentoLimpo = formValidado.documento.replace(/\D/g, '')
  if (formValidado.tipoPessoa === 'fisica' && documentoLimpo.length !== 11) {
    return { isValid: false, message: 'CPF deve conter 11 dígitos' }
  }
  if (formValidado.tipoPessoa === 'juridica' && documentoLimpo.length !== 14) {
    return { isValid: false, message: 'CNPJ deve conter 14 dígitos' }
  }
  formValidado.documento = documentoLimpo

  // Data de nascimento (somente PF)
  if (formValidado.tipoPessoa === 'fisica') {
    if (!formValidado.dataNascimento) {
      return { isValid: false, message: 'Data de nascimento é obrigatória' }
    }
    const data = new Date(formValidado.dataNascimento)
    if (isNaN(data.getTime())) {
      return { isValid: false, message: 'Data de nascimento inválida' }
    }
  } else {
    formValidado.dataNascimento = null
  }

  // Celular (remove máscara)
  if (typeof formValidado.celular !== 'string') {
    return { isValid: false, message: 'Celular inválido' }
  }
  const celularLimpo = formValidado.celular.replace(/\D/g, '')
  if (celularLimpo.length < 10 || celularLimpo.length > 11) {
    return { isValid: false, message: 'Celular deve conter 10 ou 11 dígitos' }
  }
  formValidado.celular = celularLimpo

  // Nome Fantasia e Razão Social (somente PJ)
  if (formValidado.tipoPessoa === 'juridica') {
    if (!formValidado.nomeFantasia || formValidado.nomeFantasia.trim().length < 2) {
      return { isValid: false, message: 'Nome Fantasia é obrigatório' }
    }
    if (!formValidado.razaoSocial || formValidado.razaoSocial.trim().length < 2) {
      return { isValid: false, message: 'Razão Social é obrigatória' }
    }
  }

  return { isValid: true, form: formValidado }
}

export { validarUpdateUsuario }
