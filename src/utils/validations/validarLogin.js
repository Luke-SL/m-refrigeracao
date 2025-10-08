const validarLogin = async (email, password) => {
  if (!email) return { isValid: false, message: 'E-mail é obrigatório' }
  if (!/.+@.+\..+/.test(email)) return { isValid: false, message: 'E-mail inválido' }

  if (!password) return { isValid: false, message: 'Senha é obrigatória' }
  if (password.length < 8)
    return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' }

  return { isValid: true, email, password }
}

export { validarLogin }
