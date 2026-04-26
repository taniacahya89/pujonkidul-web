import { useEffect } from 'react'
import { useBudget } from '../hooks/useBudget'
import { useDestinations } from '../hooks/useDestinations'
import BudgetForm from '../features/budget/BudgetForm'
import BudgetResult from '../features/budget/BudgetResult'
import TravelTips from '../features/budget/TravelTips'

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

  useDestinations() // pastikan destinasi tersedia untuk multi-select

  useEffect(() => {
    resetResult()
  }, [])

  const handleSubmit = async (formData) => {
    await calculateBudget(formData)
    setTimeout(() => {
      document.getElementById('budget-result')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <div className="max-w-7xl mx-auto px-6" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-3)', marginBottom: '8px' }}
        >
          Perencanaan Perjalanan
        </p>
        <h1 className="font-display text-3xl" style={{ color: 'var(--text-1)', marginBottom: '8px' }}>
          Kalkulator Budget
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>
          Estimasi biaya perjalanan ke Pujon Kidul berdasarkan kota asal, kendaraan, dan hari kunjungan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: '#fff',
            border: '1px solid var(--surface-2)',
            boxShadow: '0 1px 4px rgba(44,46,15,0.06)',
          }}
        >
          <h2
            className="font-semibold text-base"
            style={{ color: 'var(--text-1)', marginBottom: '20px' }}
          >
            Detail Perjalanan
          </h2>

          {error && (
            <div
              className="rounded-xl p-3 text-sm"
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                marginBottom: '16px',
              }}
            >
              {error}
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

        {/* Hasil */}
        <div id="budget-result" className="space-y-5">
          {!result && !isCalculating && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                backgroundColor: '#fff',
                border: '1px solid var(--surface-2)',
                boxShadow: '0 1px 4px rgba(44,46,15,0.06)',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🧮</div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-1)', marginBottom: '6px' }}>
                Isi form dan klik "Hitung Budget"
              </p>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                Hasil estimasi akan muncul di sini
              </p>
            </div>
          )}

          {isCalculating && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                backgroundColor: '#fff',
                border: '1px solid var(--surface-2)',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>Menghitung estimasi budget...</p>
            </div>
          )}

          {result && !isCalculating && (
            <>
              <BudgetResult result={result} />
              <TravelTips tips={result.tips} bestVisitTime={result.best_visit_time} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BudgetPage
