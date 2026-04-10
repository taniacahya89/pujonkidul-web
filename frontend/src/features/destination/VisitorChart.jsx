import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Daftarkan komponen Chart.js yang dibutuhkan
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Komponen bar chart untuk menampilkan data kunjungan bulanan
// Prop visitorData: array of { month: string, count: number }
function VisitorChart({ visitorData }) {
  // Tampilkan pesan jika data tidak tersedia
  if (!visitorData || visitorData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
        <p className="text-gray-400 text-sm">Data pengunjung belum tersedia</p>
      </div>
    )
  }

  // Siapkan data untuk Chart.js
  const chartData = {
    labels: visitorData.map((d) => d.month),
    datasets: [
      {
        label: 'Jumlah Pengunjung',
        data: visitorData.map((d) => d.count),
        backgroundColor: 'rgba(22, 163, 74, 0.7)',
        borderColor: 'rgba(22, 163, 74, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  // Konfigurasi tampilan chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString('id-ID')} pengunjung`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString('id-ID'),
          font: { size: 11 },
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: {
        ticks: { font: { size: 11 } },
        grid: { display: false },
      },
    },
  }

  return (
    <div className="h-48">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default VisitorChart
