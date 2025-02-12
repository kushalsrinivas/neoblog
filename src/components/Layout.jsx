import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center py-8 text-gray-500">
        © {new Date().getFullYear()} Minimal Blog. All rights reserved.
      </footer>
    </div>
  )
}

export default Layout
