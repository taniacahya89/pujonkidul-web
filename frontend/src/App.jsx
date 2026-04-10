import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import WisataPage from './pages/WisataPage'
import PetaPage from './pages/PetaPage'
import BudgetPage from './pages/BudgetPage'
import WebGISPage from './pages/WebGISPage'

// Komponen utama aplikasi dengan routing
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigasi utama */}
      <Navbar />

      {/* Konten halaman berdasarkan route */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wisata" element={<WisataPage />} />
          <Route path="/peta" element={<PetaPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/webgis" element={<WebGISPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
