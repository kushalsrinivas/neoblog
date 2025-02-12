import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="border-b-2 border-accent bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-accent hover:text-text transition-colors">
            MINIMAL BLOG
          </Link>
          <div className="space-x-8">
            <Link to="/" className="brutal-btn inline-block">
              HOME
            </Link>
            <a href="#" className="brutal-btn inline-block">
              ABOUT
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
