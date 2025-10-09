// validarEndereco.js
const validarEndereco = async (form, estados) => {
  // CEP
  if (typeof form.cep !== 'string') return { isValid: false, message: 'CEP inválido' }
  form.cep = form.cep.trim()
  const cepRegex = /^\d{8}$/ // 8 dígitos consecutivos
  if (!cepRegex.test(form.cep))
    return { isValid: false, message: 'CEP inválido. Formato esperado: 00000-000' }

  // Logradouro
  if (typeof form.logradouro !== 'string') return { isValid: false, message: 'Logradouro inválido' }
  form.logradouro = form.logradouro.trim()
  if (form.logradouro.length < 2) return { isValid: false, message: 'Logradouro muito curto' }
  if (form.logradouro.length > 100) return { isValid: false, message: 'Logradouro muito longo' }

  // Número
  if (!form.numero || (typeof form.numero !== 'string' && typeof form.numero !== 'number'))
    return { isValid: false, message: 'Número é obrigatório' }
  form.numero = String(form.numero).trim()
  if (form.numero.length > 10) return { isValid: false, message: 'Número muito longo' }

  // Complemento (opcional)
  if (form.complemento && typeof form.complemento === 'string') {
    form.complemento = form.complemento.trim()
    if (form.complemento.length > 50) return { isValid: false, message: 'Complemento muito longo' }
  }

  // Bairro
  if (typeof form.bairro !== 'string') return { isValid: false, message: 'Bairro inválido' }
  form.bairro = form.bairro.trim()
  if (form.bairro.length < 2) return { isValid: false, message: 'Bairro muito curto' }
  if (form.bairro.length > 50) return { isValid: false, message: 'Bairro muito longo' }

  // Cidade
  if (typeof form.cidade !== 'string') return { isValid: false, message: 'Cidade inválida' }
  form.cidade = form.cidade.trim()
  if (form.cidade.length < 2) return { isValid: false, message: 'Cidade muito curta' }
  if (form.cidade.length > 50) return { isValid: false, message: 'Cidade muito longa' }

  // Estado
  const estadosValidos = estados.map((e) => e.value)
  if (typeof form.estado !== 'string' || !estadosValidos.includes(form.estado))
    return { isValid: false, message: 'Estado inválido' }

  // Endereço padrão (booleano)
  form.enderecoPadrao = !!form.enderecoPadrao

  return { isValid: true, form }
}

export { validarEndereco }
