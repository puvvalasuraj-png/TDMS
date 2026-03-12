import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Hammer, Loader2, AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { motion } from "motion/react";

interface MyBookingsProps {
  user: any;
}

export default function MyBookings({ user }: MyBookingsProps) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user.id]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings/user/${user.id}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-48 text-stone-400 gap-4">
      <Loader2 size={40} className="animate-spin text-emerald-500" />
      <p className="font-medium uppercase tracking-widest text-xs">Loading Your Bookings...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-stone-900">My Bookings</h1>
        <p className="text-stone-500">Track the status of your service requests and upcoming appointments.</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking: any, i) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-stone-200 rounded-[32px] p-8 shadow-xl shadow-stone-900/5 flex flex-col md:flex-row md:items-center justify-between gap-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 shrink-0">
                  <img src={`https://picsum.photos/seed/${booking.worker_skill.toLowerCase()}/200/200`} alt={booking.worker_name} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {booking.worker_skill}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">• Booking ID: #{booking.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">{booking.worker_name}</h3>
                  <div className="flex items-center gap-4 text-stone-500 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {booking.booking_date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      10:00 AM
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                  booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                  booking.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {booking.status === 'Confirmed' ? <CheckCircle2 size={14} /> :
                   booking.status === 'Rejected' ? <XCircle size={14} /> :
                   <Clock size={14} />}
                  {booking.status}
                </div>
                
                {booking.status === 'Confirmed' && (
                  <p className="text-xs text-emerald-600 font-medium text-right">
                    Professional has been notified and will arrive on time.
                  </p>
                )}
                {booking.status === 'Rejected' && (
                  <p className="text-xs text-red-600 font-medium text-right">
                    Worker is busy. Please book another professional.
                  </p>
                )}
                {booking.status === 'Pending' && (
                  <p className="text-xs text-amber-600 font-medium text-right">
                    Waiting for admin approval.
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
            <Info size={32} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">No bookings yet</h3>
          <p className="text-stone-500">You haven't made any service requests yet.</p>
          <button className="mt-6 bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-stone-900/10">
            Browse Professionals
          </button>
        </div>
      )}
    </div>
  );
}
