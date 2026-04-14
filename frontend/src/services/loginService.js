import api, { ApiError } from '@/services/api'

function normalizeCredentials(credentials = {}) {
  const payload = {
    username: String(credentials.username ?? '').trim(),
    password: String(credentials.password ?? ''),
  }

  if (credentials.sso_token) {
    payload.sso_token = String(credentials.sso_token)
  }

  return payload
}

export async function submitLogin(credentials = {}) {
  const payload = normalizeCredentials(credentials)

  if (!payload.username) {
    throw new ApiError('Username wajib diisi.')
  }

  if (!payload.password) {
    throw new ApiError('Password wajib diisi.')
  }

  const session = await api.auth.login(payload)

  return {
    token:    session?.token    ?? null,
    user:     session?.user     ?? null,
    redirect: session?.redirect ?? null,
  }
}

const loginService = { submitLogin }

export default loginService