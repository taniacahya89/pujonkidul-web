// Komponen skeleton loading untuk berbagai konteks tampilan
// Prop type: 'card' | 'map' | 'list' | 'weather'
function SkeletonLoader({ type = 'card', count = 3 }) {
  // Skeleton untuk card destinasi
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
            <div className="flex gap-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Skeleton untuk peta
  if (type === 'map') {
    return (
      <div className="w-full h-[500px] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-gray-400 text-sm">Memuat peta...</div>
      </div>
    )
  }

  // Skeleton untuk list (rute akses jalan)
  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        ))}
      </div>
    )
  }

  // Skeleton untuk widget cuaca
  if (type === 'weather') {
    return (
      <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2 animate-pulse">
        <div className="w-12 h-12 bg-white/30 rounded-full" />
        <div>
          <div className="h-6 bg-white/30 rounded w-16 mb-1" />
          <div className="h-4 bg-white/30 rounded w-20" />
        </div>
      </div>
    )
  }

  return null
}

export default SkeletonLoader
