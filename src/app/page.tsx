export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-8">
          🎮 Game Prototype
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          A starter kit for prototyping games. Built with Next.js, TypeScript, and Tailwind CSS.
        </p>
        
        <a
          href="/game"
          className="inline-block px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          Play Game →
        </a>
        
        <div className="mt-16 text-sm text-gray-500">
          <p>Perfect for game jams, prototypes, and learning game development</p>
          <p className="mt-2">Copy this starter kit to create your own game prototypes!</p>
        </div>
      </div>
    </div>
  );
}
