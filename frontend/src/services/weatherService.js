import api from './api'

// Service untuk data cuaca — backend bertindak sebagai proxy ke OWM
// API key OWM tidak pernah ada di frontend

// Mengambil data cuaca terkini untuk kawasan Pujon Kidul
export async function fetchWeather() {
  const response = await api.get('/api/v1/weather')
  return response.data.data
}
