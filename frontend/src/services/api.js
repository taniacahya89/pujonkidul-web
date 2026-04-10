import axios from 'axios'

// Buat instance Axios dengan base URL dari environment variable
// VITE_API_BASE_URL dikonfigurasi di file .env frontend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000, // Timeout 15 detik
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
