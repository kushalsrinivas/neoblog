import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="border-b-2 border-accent bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-black text-accent hover:text-text transition-colors">
            MINIMAL BLOG
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="brutal-btn">
              HOME
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/write" 
                  className="brutal-btn bg-accent text-primary hover:bg-primary hover:text-accent border-2 border-accent"
                >
                  COMPOSE
                </Link>
                
                <div className="relative group">
                  <button className="brutal-btn">
                    PROFILE
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-primary border-2 border-accent invisible group-hover:visible">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-accent hover:text-primary transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/drafts" 
                      className="block px-4 py-2 hover:bg-accent hover:text-primary transition-colors"
                    >
                      My Drafts
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 hover:bg-accent hover:text-primary transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="brutal-btn bg-accent text-primary hover:bg-primary hover:text-accent border-2 border-accent"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
