const validarMarcaCategoria = async (form) => {
  if (typeof form.nome !== 'string') return { isValid: false, message: 'Nome inválido' }
  form.nome = form.nome.trim()
  if (form.nome.length < 2) return { isValid: false, message: 'Nome muito curto' }
  if (form.nome.length > 100) return { isValid: false, message: 'Nome muito longo' }
  return { isValid: true, form }
}

export { validarMarcaCategoria }
