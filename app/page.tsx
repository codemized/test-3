export default function Home() {
  return (
    <div className="min-h-screen bg-retro-dark grid-retro scan-lines p-8">
      {/* Header retro futurista */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-6xl font-bold text-center mb-4 text-neon-cyan neon-glow flicker font-retro">
          RETRO FUTURE
        </h1>
        <p className="text-center text-neon-pink text-xl neon-glow font-retro">
          &gt; SYSTEM ONLINE :: 2084 &lt;
        </p>
      </div>

      {/* Grid de items */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <div
            key={item}
            className="relative bg-retro-darker border-2 border-neon-purple neon-border 
                       p-8 transition-all duration-300 hover:scale-105 
                       hover:border-neon-cyan vhs-effect group"
          >
            <div className="absolute top-2 left-2 text-neon-pink text-xs font-retro">
              [{String(item).padStart(2, '0')}]
            </div>
            
            <div className="text-center mt-4">
              <div className="text-4xl mb-4 text-neon-cyan group-hover:text-neon-pink transition-colors">
                ▲
              </div>
              <h3 className="text-xl font-retro text-neon-purple group-hover:neon-glow transition-all">
                NODE {item}
              </h3>
              <div className="mt-4 text-neon-cyan text-sm font-retro opacity-70">
                STATUS: ACTIVE
              </div>
            </div>

            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-cyan"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-cyan"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-cyan"></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 border-t-2 border-neon-purple pt-6">
        <div className="flex justify-between items-center font-retro text-sm">
          <div className="text-neon-cyan">
            &gt; MEMORY: <span className="text-neon-pink">9/9 BLOCKS</span>
          </div>
          <div className="text-neon-cyan">
            SYSTEM V2.84
          </div>
          <div className="text-neon-pink animate-pulse">
            ● REC
          </div>
        </div>
      </div>

      {/* Líneas decorativas de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
      </div>
    </div>
  );
}
