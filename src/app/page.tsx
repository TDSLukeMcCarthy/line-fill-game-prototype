export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          🧩 Path Fill Puzzle
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Draw a path to light up all the tiles
        </p>
        
        <a
          href="/game"
          className="inline-block px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
        >
          Start Game
        </a>
        
        <div className="mt-16 text-sm text-gray-500">
          <p>Fill every tile with a continuous path</p>
          <p className="mt-2">Perfect for brain training and spatial reasoning</p>
        </div>
      </div>
    </div>
  );
}
