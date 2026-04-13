import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import WisataPage from './pages/WisataPage'
import PetaPage from './pages/PetaPage'
import BudgetPage from './pages/BudgetPage'
import AksesJalanPage from './pages/AksesJalanPage'
import Chatbot from './components/Chatbot'

// Komponen utama aplikasi dengan routing
function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F3E1' }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wisata" element={<WisataPage />} />
          <Route path="/peta" element={<PetaPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/akses-jalan" element={<AksesJalanPage />} />
        </Routes>
      </main>
      <Footer />
      {/* Chatbot floating — selalu accessible */}
      <Chatbot />
    </div>
  )
}

export default App
