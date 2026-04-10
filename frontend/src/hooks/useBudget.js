import { useEffect } from 'react'
import useBudgetStore from '../store/budgetStore'

// Custom hook untuk mengelola state dan logika kalkulator budget
export function useBudget() {
  const {
    provinces,
    cities,
    result,
    isLoading,
    isCalculating,
    error,
    fetchProvinces,
    fetchCities,
    calculateBudget,
    resetResult,
  } = useBudgetStore()

  // Fetch provinsi saat pertama kali mount
  useEffect(() => {
    if (provinces.length === 0) {
      fetchProvinces()
    }
  }, [])

  // Fungsi untuk menangani perubahan provinsi (fetch kota dependent)
  const handleProvinceChange = (provinceId) => {
    if (provinceId) {
      fetchCities(provinceId)
    } else {
      fetchCities(null)
    }
  }

  return {
    provinces,
    cities,
    result,
    isLoading,
    isCalculating,
    error,
    handleProvinceChange,
    calculateBudget,
    resetResult,
  }
}
