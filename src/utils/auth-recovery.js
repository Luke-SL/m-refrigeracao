// src/utils/auth-recovery.js

/**
 * Detecta e limpa tokens inválidos do Supabase
 * Útil quando um usuário é deletado mas o browser ainda tem sessão
 */
export const clearInvalidSession = () => {
  // Limpar tokens do Supabase no localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('sb-')) {
      console.log('🧹 Removendo token inválido:', key)
      localStorage.removeItem(key)
    }
  })

  // Limpar sessionStorage também
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('sb-')) {
      console.log('🧹 Removendo token inválido (session):', key)
      sessionStorage.removeItem(key)
    }
  })

  console.log('✅ Sessão inválida limpa com sucesso')
  return true
}

/**
 * Detecta erro 403/406 e limpa automaticamente
 */
export const handleAuthError = (error) => {
  // Erro 403 = Token inválido/expirado
  if (error?.status === 403 || error?.code === '403') {
    console.warn('⚠️ Token inválido detectado (403). Limpando sessão...')
    clearInvalidSession()
    window.location.href = '/login'
    return true
  }

  // Erro 406 = Token corrompido ou headers incorretos
  if (error?.status === 406 || error?.code === '406') {
    console.warn('⚠️ Erro 406 detectado (token corrompido). Limpando sessão...')
    clearInvalidSession()
    window.location.href = '/login'
    return true
  }

  return false
}

/**
 * Middleware para interceptar erros de auth
 * Detecta erros 403 e 406 automaticamente
 */
export const setupAuthErrorInterceptor = () => {
  const originalFetch = window.fetch

  window.fetch = async (...args) => {
    const response = await originalFetch(...args)

    // Se for request do Supabase
    if (args[0]?.toString().includes('supabase.co')) {
      // Erro 403 = Token inválido
      if (response.status === 403) {
        console.warn('⚠️ Erro 403 interceptado. Limpando sessão...')
        clearInvalidSession()
        window.location.href = '/login'
      }

      // Erro 406 = Token corrompido ou headers incorretos
      if (response.status === 406) {
        console.warn('⚠️ Erro 406 interceptado. Limpando sessão...')
        clearInvalidSession()
        window.location.href = '/login'
      }
    }

    return response
  }
}
