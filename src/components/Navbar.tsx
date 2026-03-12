import { Link } from "react-router-dom";
import { Hammer, User, LogOut, LayoutDashboard, ClipboardList } from "lucide-react";

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-stone-900 text-white p-1.5 rounded-lg group-hover:bg-emerald-600 transition-colors">
            <Hammer size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">TDMS</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link to="/workers" className="hover:text-stone-900 transition-colors">Find Workers</Link>
          {user && (
            <Link to="/my-bookings" className="hover:text-stone-900 transition-colors flex items-center gap-1.5">
              <ClipboardList size={16} />
              My Bookings
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-stone-900 transition-colors flex items-center gap-1.5">
              <LayoutDashboard size={16} />
              Admin Panel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full">
                <User size={14} />
                <span>{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-stone-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
