import { useState, useEffect } from "react";
import { Check, X, Clock, User, Hammer, Calendar, Loader2, AlertCircle, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "workers">("bookings");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, workersRes] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/admin/workers")
      ]);
      setBookings(await bookingsRes.json());
      setWorkers(await workersRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings(bookings.map((b: any) => b.id === id ? { ...b, status } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvailabilityToggle = async (id: number, current: string) => {
    const availability = current === 'Available' ? 'Busy' : 'Available';
    try {
      const res = await fetch(`/api/admin/workers/${id}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability }),
      });
      if (res.ok) {
        setWorkers(workers.map((w: any) => w.id === id ? { ...w, availability } : w));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-48 text-stone-400 gap-4">
      <Loader2 size={40} className="animate-spin text-emerald-500" />
      <p className="font-medium uppercase tracking-widest text-xs">Loading Admin Data...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-stone-900 italic serif">Admin Dashboard</h1>
          <p className="text-stone-500">Manage booking requests and tradesperson availability.</p>
        </div>
        
        <div className="flex bg-white border border-stone-200 p-1 rounded-2xl shadow-sm">
          <button 
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'bookings' ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/10' : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            Bookings
          </button>
          <button 
            onClick={() => setActiveTab("workers")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'workers' ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/10' : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            Workers
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'bookings' ? (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white border border-stone-200 rounded-[32px] overflow-hidden shadow-xl shadow-stone-900/5"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">User</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Professional</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Date</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {bookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                            <User size={14} />
                          </div>
                          <span className="font-bold text-stone-900">{booking.user_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="font-bold text-stone-900">{booking.worker_name}</p>
                          <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">{booking.worker_skill}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-stone-500 font-medium">
                          <Calendar size={14} />
                          {booking.booking_date}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          booking.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {booking.status === 'Pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                              className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              title="Confirm"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                              className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Reject"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="workers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {workers.map((worker: any) => (
              <div key={worker.id} className="bg-white border border-stone-200 rounded-[32px] p-8 shadow-xl shadow-stone-900/5 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-stone-100">
                    <img src={`https://picsum.photos/seed/${worker.skill.toLowerCase()}/200/200`} alt={worker.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{worker.name}</h4>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{worker.skill}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      worker.availability === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {worker.availability}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleAvailabilityToggle(worker.id, worker.availability)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      worker.availability === 'Available' 
                        ? 'bg-stone-900 text-white hover:bg-red-600' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {worker.availability === 'Available' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    Set {worker.availability === 'Available' ? 'Busy' : 'Available'}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
