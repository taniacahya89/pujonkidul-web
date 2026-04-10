import { create } from 'zustand'
import {
  fetchProvinces,
  fetchCitiesByProvince,
  calculateBudget,
} from '../services/budgetService'

// Zustand store untuk manajemen state kalkulator budget
const useBudgetStore = create((set, get) => ({
  // State
  provinces: [],    // Daftar provinsi untuk dropdown
  cities: [],       // Daftar kota berdasarkan provinsi yang dipilih
  result: null,     // Hasil kalkulasi budget
  isLoading: false,
  isCalculating: false,
  error: null,

  // Mengambil semua provinsi untuk dropdown
  fetchProvinces: async () => {
    const { provinces } = get()
    if (provinces.length > 0) return

    set({ isLoading: true, error: null })
    try {
      const data = await fetchProvinces()
      set({ provinces: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Mengambil kota berdasarkan ID provinsi (dropdown dependent)
  // Dipanggil setiap kali pengguna memilih provinsi baru
  fetchCities: async (provinceId) => {
    if (!provinceId) {
      set({ cities: [] })
      return
    }

    set({ isLoading: true, error: null, cities: [] })
    try {
      const data = await fetchCitiesByProvince(provinceId)
      set({ cities: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  // Menghitung estimasi budget perjalanan
  calculateBudget: async (request) => {
    set({ isCalculating: true, error: null, result: null })
    try {
      const data = await calculateBudget(request)
      set({ result: data, isCalculating: false })
    } catch (err) {
      set({ error: err.message, isCalculating: false })
    }
  },

  // Reset hasil kalkulasi
  resetResult: () => set({ result: null, error: null }),
}))

export default useBudgetStore
