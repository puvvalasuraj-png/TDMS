/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Listing from "./pages/Listing";
import WorkerDetails from "./pages/WorkerDetails";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth onLogin={handleLogin} />} />
            <Route path="/workers" element={<Listing />} />
            <Route path="/workers/:id" element={<WorkerDetails user={user} />} />
            <Route 
              path="/admin" 
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/my-bookings" 
              element={user ? <MyBookings user={user} /> : <Navigate to="/auth" />} 
            />
          </Routes>
        </main>
        <footer className="bg-stone-900 text-stone-400 py-12 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest mb-4">Tradespersons Database Management System</p>
            <div className="h-px bg-stone-800 w-24 mx-auto mb-4"></div>
            <p className="text-xs opacity-50">&copy; 2026 TDMS. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

