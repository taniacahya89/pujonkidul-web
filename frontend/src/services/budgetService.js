import api from './api'

// Service untuk kalkulator budget perjalanan

// Mengambil semua provinsi untuk dropdown
export async function fetchProvinces() {
  const response = await api.get('/api/v1/provinces')
  return response.data.data
}

// Mengambil kota berdasarkan ID provinsi (dropdown dependent)
export async function fetchCitiesByProvince(provinceId) {
  const response = await api.get(`/api/v1/provinces/${provinceId}/cities`)
  return response.data.data
}

// Mengirim request kalkulasi budget ke backend
// payload: { province_id, city_id, vehicle_type, person_count, destination_ids, meal_budget, souvenir_budget, estimated_days }
export async function calculateBudget(payload) {
  const response = await api.post('/api/v1/budget/calculate', payload)
  return response.data.data
}
