import api from '@/services/api'

export async function getJobLevels() {
  const payload = await api.request('/master/job-levels')
  return Array.isArray(payload) ? payload : []
}