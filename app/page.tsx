export default function Home() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <div 
            key={item} 
            className="bg-white shadow-md rounded-lg p-6 text-center 
                       transition-transform hover:scale-105 hover:shadow-xl"
          >
            Grid Item {item}
          </div>
        ))}
      </div>
    </div>
  )
}