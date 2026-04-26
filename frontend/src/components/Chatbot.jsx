import { useState, useRef, useEffect } from 'react'

const FAQ = [
  {
    keywords: ['wisata apa', 'objek wisata', 'tempat wisata', 'ada apa', 'destinasi', 'tempat yang bisa', 'mau ke mana'],
    answer: 'Objek wisata di Pujon Kidul meliputi Cafe Sawah, Coban Rondo, Bukit Nirwana, Bobocabin Coban Rondo, Kelinci Park, dan Florawisata Santerra De Laponte.',
  },
  {
    keywords: ['menarik', 'terkenal', 'keunggulan', 'kenapa', 'istimewa', 'unik', 'bagus'],
    answer: 'Daya tarik utama Pujon Kidul adalah konsep wisata pedesaan yang asri, pemandangan sawah dan pegunungan, serta pengalaman edukasi seperti bertani dan beternak.',
  },
  {
    keywords: ['lokasi', 'di mana', 'letaknya', 'daerah mana', 'alamat', 'letak', 'dimana'],
    answer: 'Pujon Kidul berada di Kecamatan Pujon, Kabupaten Malang, Jawa Timur — sekitar 1–1,5 jam dari Kota Malang.',
  },
  {
    keywords: ['harga tiket', 'tiket', 'biaya masuk', 'berapa', 'bayar', 'tarif masuk', 'harga masuk'],
    answer: 'Harga tiket masuk berkisar Rp 10.000–Rp 35.000 per orang tergantung destinasi. Beberapa tempat memiliki harga weekday dan weekend yang berbeda.',
  },
  {
    keywords: ['jam buka', 'buka', 'tutup', 'jam berapa', 'operasional', 'kapan buka', 'sampai jam'],
    answer: 'Umumnya buka pukul 08.00–17.00 WIB setiap hari. Bobocabin Coban Rondo buka 24 jam, Cafe Sawah hingga 18.00.',
  },
  {
    keywords: ['spot foto', 'foto', 'instagramable', 'selfie', 'fotografi', 'tempat foto'],
    answer: 'Spot foto menarik: area persawahan di Cafe Sawah, taman bunga di Florawisata Santerra, panorama bukit di Bukit Nirwana, dan latar air terjun di Coban Rondo.',
  },
  {
    keywords: ['aktivitas', 'kegiatan', 'ngapain', 'bisa apa', 'wahana'],
    answer: 'Pengunjung dapat berfoto, menikmati kuliner, belajar bertani, memberi makan ternak, glamping, dan rekreasi keluarga.',
  },
  {
    keywords: ['keluarga', 'anak', 'cocok', 'liburan keluarga', 'bawa anak', 'ramah anak'],
    answer: 'Sangat cocok untuk keluarga. Kelinci Park sangat direkomendasikan untuk anak-anak.',
  },
  {
    keywords: ['fasilitas', 'toilet', 'mushola', 'parkir', 'gazebo'],
    answer: 'Fasilitas tersedia: area parkir, toilet, mushola, tempat makan, gazebo, dan spot foto.',
  },
  {
    keywords: ['makan', 'kuliner', 'makanan', 'restoran', 'cafe', 'warung'],
    answer: 'Tersedia berbagai tempat makan. Cafe Sawah menawarkan makanan khas pedesaan dengan suasana persawahan yang unik.',
  },
  {
    keywords: ['penginapan', 'menginap', 'homestay', 'villa', 'glamping', 'bobocabin'],
    answer: 'Tersedia homestay dan villa warga. Bobocabin Coban Rondo menawarkan glamping premium di tengah hutan pinus.',
  },
  {
    keywords: ['cara ke sana', 'transportasi', 'akses', 'jalan', 'kendaraan', 'naik apa', 'rute'],
    answer: 'Dapat dilalui kendaraan roda dua maupun roda empat. Dari Kota Malang sekitar 1–1,5 jam via Kota Batu.',
  },
  {
    keywords: ['waktu terbaik', 'kapan', 'sebaiknya', 'jam bagus', 'pagi', 'sore'],
    answer: 'Waktu terbaik: pagi (08.00–10.00) atau sore (15.00–17.00) — cuaca lebih sejuk dan pencahayaan bagus.',
  },
]

function preprocess(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').trim()
}

function findAnswer(input) {
  const processed = preprocess(input)
  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => processed.includes(kw))) return faq.answer
  }
  return 'Maaf, saya belum memahami pertanyaan itu. Coba tanyakan tentang: lokasi, tiket, jam buka, fasilitas, atau aktivitas wisata di Pujon Kidul.'
}

const WELCOME = {
  id: 0,
  role: 'bot',
  text: 'Selamat datang. Tanyakan apa saja tentang wisata Pujon Kidul — destinasi, tiket, jam buka, atau fasilitas.',
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: trimmed },
      { id: Date.now() + 1, role: 'bot', text: findAnswer(trimmed) },
    ])
    setInput('')
  }

  return (
    <>
      {/* Panel chatbot */}
      {open && (
        <div
          className="fixed bottom-24 right-4 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            width: '340px',
            maxHeight: '500px',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--surface-2)',
            boxShadow: '0 12px 40px rgba(20,22,8,0.2)',
          }}
        >
          {/* Header — solid, tidak ada efek */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--surface-2)' }}
          >
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>Asisten Wisata</p>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>Pujon Kidul Explore</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                color: 'var(--text-3)',
                fontSize: '13px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Pesan */}
          <div
            className="flex-1 overflow-y-auto p-3"
            style={{ minHeight: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <div
                  style={
                    msg.role === 'user'
                      ? {
                          backgroundColor: 'var(--accent)',
                          color: '#F8F3E1',
                          padding: '8px 12px',
                          borderRadius: '12px 12px 2px 12px',
                          fontSize: '12px',
                          lineHeight: '1.6',
                          maxWidth: '85%',
                        }
                      : {
                          backgroundColor: '#fff',
                          color: 'var(--text-1)',
                          padding: '8px 12px',
                          borderRadius: '12px 12px 12px 2px',
                          fontSize: '12px',
                          lineHeight: '1.6',
                          maxWidth: '85%',
                          border: '1px solid var(--surface-2)',
                        }
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
            className="flex items-center gap-2 p-3 shrink-0"
            style={{ borderTop: '1px solid var(--surface-2)', backgroundColor: '#fff' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
              placeholder="Ketik pertanyaan..."
              className="flex-1 text-xs px-3 py-2 rounded-lg outline-none"
              style={{
                backgroundColor: 'var(--bg)',
                color: 'var(--text-1)',
                border: '1px solid var(--surface-2)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                backgroundColor: input.trim() ? 'var(--accent)' : 'var(--surface-2)',
                color: input.trim() ? '#F8F3E1' : 'var(--text-3)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'background-color 0.15s',
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Floating button — lebih besar, lebih discoverable */}
      <button
        id="chatbot-btn"
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-5 right-5 z-50 rounded-full flex items-center gap-2 font-semibold transition-all duration-200"
        style={{
          height: '52px',
          padding: '0 20px',
          backgroundColor: 'var(--accent)',
          color: '#F8F3E1',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(74,103,65,0.4)',
          fontSize: '14px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 22px rgba(74,103,65,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 18px rgba(74,103,65,0.4)'
        }}
        aria-label="Buka asisten wisata"
      >
        <span style={{ fontSize: '18px' }}>{open ? '✕' : '💬'}</span>
        {!open && <span>Tanya Kami</span>}
      </button>
    </>
  )
}

export default Chatbot
