import { useState, useRef, useEffect } from 'react'

// ============================================================
// Dataset FAQ — intent-based keyword matching
// Sumber: dataset yang diberikan, tidak ada data fiktif
// ============================================================
const FAQ = [
  {
    intent: 'objek_wisata',
    keywords: ['wisata apa', 'objek wisata', 'tempat wisata', 'ada apa', 'destinasi', 'tempat yang bisa', 'mau ke mana'],
    answer: 'Objek wisata di Pujon Kidul meliputi Cafe Sawah, Coban Rondo, Bukit Nirwana, Bobocabin Coban Rondo, Kelinci Park, dan Florawisata Santerra De Laponte.',
  },
  {
    intent: 'daya_tarik',
    keywords: ['menarik', 'terkenal', 'keunggulan', 'kenapa', 'istimewa', 'unik', 'bagus'],
    answer: 'Daya tarik utama Pujon Kidul adalah konsep wisata pedesaan yang asri, pemandangan sawah dan pegunungan, serta pengalaman edukasi yang unik seperti bertani dan beternak.',
  },
  {
    intent: 'lokasi',
    keywords: ['lokasi', 'di mana', 'letaknya', 'daerah mana', 'alamat', 'letak', 'dimana'],
    answer: 'Pujon Kidul berada di Kecamatan Pujon, Kabupaten Malang, Jawa Timur, dan dapat diakses sekitar 1–1,5 jam dari Kota Malang.',
  },
  {
    intent: 'tiket',
    keywords: ['harga tiket', 'tiket', 'biaya masuk', 'berapa', 'bayar', 'tarif masuk', 'harga masuk'],
    answer: 'Harga tiket masuk berkisar Rp 10.000–Rp 35.000 per orang tergantung destinasi. Beberapa tempat memiliki harga weekday dan weekend yang berbeda.',
  },
  {
    intent: 'jam_buka',
    keywords: ['jam buka', 'buka', 'tutup', 'jam berapa', 'operasional', 'kapan buka', 'sampai jam'],
    answer: 'Umumnya objek wisata buka mulai pukul 08.00 hingga 17.00 WIB setiap hari. Bobocabin Coban Rondo buka 24 jam, sedangkan Cafe Sawah buka hingga 18.00.',
  },
  {
    intent: 'spot_foto',
    keywords: ['spot foto', 'foto', 'instagramable', 'selfie', 'kamera', 'fotografi', 'tempat foto'],
    answer: 'Tersedia banyak spot foto menarik seperti area persawahan di Cafe Sawah, taman bunga di Florawisata Santerra, panorama bukit di Bukit Nirwana, serta latar air terjun di Coban Rondo.',
  },
  {
    intent: 'aktivitas',
    keywords: ['aktivitas', 'kegiatan', 'ngapain', 'bisa apa', 'acara', 'program', 'wahana'],
    answer: 'Pengunjung dapat berfoto, menikmati kuliner, belajar bertani, memberi makan ternak, berjalan santai di area sawah, glamping, dan rekreasi bersama keluarga.',
  },
  {
    intent: 'keluarga',
    keywords: ['keluarga', 'anak', 'cocok', 'aman', 'liburan keluarga', 'bawa anak', 'ramah anak'],
    answer: 'Ya, sangat cocok untuk keluarga karena tersedia area bermain, aktivitas edukatif, dan lingkungan yang aman serta nyaman. Kelinci Park sangat direkomendasikan untuk anak-anak.',
  },
  {
    intent: 'fasilitas',
    keywords: ['fasilitas', 'toilet', 'mushola', 'lengkap', 'parkir', 'tempat duduk', 'gazebo'],
    answer: 'Fasilitas yang tersedia meliputi area parkir, toilet, mushola, tempat makan, gazebo, serta area bermain dan spot foto.',
  },
  {
    intent: 'kuliner',
    keywords: ['makan', 'kuliner', 'makanan', 'restoran', 'cafe', 'warung', 'tempat makan'],
    answer: 'Tersedia berbagai tempat makan, terutama Cafe Sawah yang menawarkan makanan khas pedesaan dengan suasana persawahan yang unik.',
  },
  {
    intent: 'penginapan',
    keywords: ['penginapan', 'menginap', 'homestay', 'villa', 'hotel', 'glamping', 'bobocabin'],
    answer: 'Ya, tersedia homestay dan villa yang dikelola warga dengan harga terjangkau. Bobocabin Coban Rondo menawarkan pengalaman glamping premium di tengah hutan pinus.',
  },
  {
    intent: 'transportasi',
    keywords: ['cara ke sana', 'transportasi', 'akses', 'jalan', 'kendaraan', 'naik apa', 'rute'],
    answer: 'Akses menuju lokasi cukup mudah dan dapat dilalui kendaraan roda dua maupun roda empat. Dari Kota Malang sekitar 1–1,5 jam via Kota Batu.',
  },
  {
    intent: 'waktu_terbaik',
    keywords: ['waktu terbaik', 'kapan', 'sebaiknya', 'jam bagus', 'pagi', 'sore', 'musim'],
    answer: 'Waktu terbaik adalah pagi hari (08.00–10.00) atau sore hari (15.00–17.00) karena cuaca lebih sejuk dan pencahayaan bagus untuk berfoto.',
  },
  {
    intent: 'aturan',
    keywords: ['aturan', 'larangan', 'tidak boleh', 'boleh', 'peraturan', 'dilarang'],
    answer: 'Pengunjung wajib menjaga kebersihan, tidak merusak fasilitas, dan mengikuti aturan yang berlaku di setiap area wisata.',
  },
  {
    intent: 'bawa_makanan',
    keywords: ['bawa makanan', 'piknik', 'bekal', 'bawa sendiri', 'makanan dari luar'],
    answer: 'Umumnya diperbolehkan, namun disarankan untuk membeli makanan di lokasi guna mendukung ekonomi masyarakat setempat.',
  },
]

// Preprocessing: lowercase + hapus tanda baca
function preprocess(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').trim()
}

// Cari jawaban berdasarkan keyword matching
function findAnswer(userInput) {
  const processed = preprocess(userInput)
  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => processed.includes(kw))) {
      return faq.answer
    }
  }
  return 'Maaf, saya belum memahami pertanyaan Anda. Coba tanyakan tentang: lokasi, tiket, jam buka, fasilitas, atau aktivitas wisata di Pujon Kidul.'
}

// Pesan sambutan awal
const WELCOME_MSG = {
  id: 0,
  role: 'bot',
  text: 'Halo! 👋 Saya asisten wisata Pujon Kidul. Tanyakan apa saja tentang destinasi, tiket, jam buka, atau fasilitas wisata di sini.',
}

// Komponen Chatbot — floating button + chat panel
function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    const botMsg = { id: Date.now() + 1, role: 'bot', text: findAnswer(trimmed) }

    setMessages((prev) => [...prev, userMsg, botMsg])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: '#F8F3E1', maxHeight: '480px', border: '1px solid #AEB784' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: '#41431B' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#F8F3E1' }}>Asisten Wisata</p>
                <p className="text-xs" style={{ color: '#AEB784' }}>Pujon Kidul Explore</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-sm"
              style={{ color: '#AEB784' }}
              aria-label="Tutup chatbot"
            >
              ✕
            </button>
          </div>

          {/* Pesan */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: 0 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { backgroundColor: '#237227', color: '#F8F3E1', borderBottomRightRadius: '4px' }
                      : { backgroundColor: '#fff', color: '#41431B', borderBottomLeftRadius: '4px', border: '1px solid #E3DBBB' }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 p-3 border-t"
            style={{ borderColor: '#E3DBBB', backgroundColor: '#fff' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan..."
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{ backgroundColor: '#F8F3E1', color: '#41431B', border: '1px solid #AEB784' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors"
              style={{
                backgroundColor: input.trim() ? '#237227' : '#AEB784',
                color: '#F8F3E1',
              }}
              aria-label="Kirim"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        id="chatbot-btn"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110"
        style={{ backgroundColor: '#237227', color: '#F8F3E1' }}
        aria-label="Buka chatbot"
      >
        {open ? '✕' : '🤖'}
      </button>
    </>
  )
}

export default Chatbot
