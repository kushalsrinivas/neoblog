import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <Outlet />
      </main>
      <footer className="text-center py-12 text-accent font-bold border-t-2 border-accent">
        © {new Date().getFullYear()} MINIMAL BLOG. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

export default Layout;
