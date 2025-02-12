import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Minimal Blog
          </Link>
          <div className="space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              About
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
