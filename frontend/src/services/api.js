import axios from 'axios'

// Buat instance Axios dengan base URL dari environment variable
// Jika VITE_API_BASE_URL kosong, Axios pakai path relatif → Vite proxy akan forward ke backend
// Jika diisi (misal http://localhost:8080), Axios langsung ke backend (bypass proxy)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor untuk menangani error secara global
api.interceptors.response.use(
  // Response sukses — kembalikan data langsung
  (response) => response,
  // Response error — format pesan error yang konsisten
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan yang tidak diketahui'

    return Promise.reject(new Error(message))
  }
)

export default api
