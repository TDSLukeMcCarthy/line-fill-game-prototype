import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">404</h1>
        <p className="text-xl text-gray-300 mb-12">Page not found</p>
        <Link
          href="/"
          className="inline-block px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
