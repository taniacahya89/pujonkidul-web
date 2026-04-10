import { useEffect } from 'react'
import { useBudget } from '../hooks/useBudget'
import { useDestinations } from '../hooks/useDestinations'
import BudgetForm from '../features/budget/BudgetForm'
import BudgetResult from '../features/budget/BudgetResult'
import TravelTips from '../features/budget/TravelTips'

// Halaman kalkulator budget perjalanan ke Pujon Kidul
function BudgetPage() {
  const {
    provinces,
    cities,
    result,
    isLoading,
    isCalculating,
    error,
    handleProvinceChange,
    calculateBudget,
    resetResult,
  } = useBudget()

  // Pastikan data destinasi tersedia untuk multi-select
  const { destinations } = useDestinations()

  // Reset hasil saat halaman pertama kali dimuat
  useEffect(() => {
    resetResult()
  }, [])

  // Handler submit form — kirim ke backend untuk kalkulasi
  const handleSubmit = async (formData) => {
    await calculateBudget(formData)
    // Scroll ke hasil setelah kalkulasi
    setTimeout(() => {
      document.getElementById('budget-result')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header halaman */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          💰 Kalkulator Budget Perjalanan
        </h1>
        <p className="text-gray-500">
          Hitung estimasi biaya perjalanan ke Pujon Kidul berdasarkan kota asal dan preferensi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kolom kiri: Form input */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-5">📝 Detail Perjalanan</h2>

          {/* Error dari backend */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <BudgetForm
            provinces={provinces}
            cities={cities}
            isLoading={isLoading}
            isCalculating={isCalculating}
            onProvinceChange={handleProvinceChange}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Kolom kanan: Hasil kalkulasi */}
        <div id="budget-result" className="space-y-6">
          {/* Placeholder sebelum kalkulasi */}
          {!result && !isCalculating && (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="text-5xl mb-4">🧮</div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Isi form dan klik "Hitung Budget"
              </h3>
              <p className="text-gray-400 text-sm">
                Hasil estimasi biaya perjalanan akan muncul di sini
              </p>
            </div>
          )}

          {/* Loading kalkulasi */}
          {isCalculating && (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="text-4xl mb-3 animate-bounce">⏳</div>
              <p className="text-gray-600">Menghitung estimasi budget...</p>
            </div>
          )}

          {/* Hasil kalkulasi */}
          {result && !isCalculating && (
            <>
              <BudgetResult result={result} />
              <TravelTips
                tips={result.tips}
                bestVisitTime={result.best_visit_time}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BudgetPage
