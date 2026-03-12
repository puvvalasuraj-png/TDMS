import { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, MapPin, Clock, DollarSign, Phone, ShieldCheck, ArrowLeft, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WorkerDetailsProps {
  user: any;
}

export default function WorkerDetails({ user }: WorkerDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    try {
      const res = await fetch(`/api/workers/${id}`);
      const data = await res.json();
      setWorker(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }

    if (worker.availability !== 'Available') {
      alert("This worker is currently busy. Please choose another worker.");
      return;
    }

    setBookingStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          worker_id: worker.id,
          booking_date: bookingDate,
        }),
      });
      if (res.ok) {
        setBookingStatus("success");
        setTimeout(() => navigate("/my-bookings"), 2000);
      } else {
        setBookingStatus("error");
      }
    } catch (err) {
      setBookingStatus("error");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-48 text-stone-400 gap-4">
      <Loader2 size={40} className="animate-spin text-emerald-500" />
      <p className="font-medium uppercase tracking-widest text-xs">Loading Profile...</p>
    </div>
  );

  if (!worker) return (
    <div className="text-center py-48">
      <h2 className="text-2xl font-bold text-stone-900">Worker not found</h2>
      <Link to="/workers" className="text-emerald-600 font-bold hover:underline mt-4 inline-block">Back to listings</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 rounded-[32px] overflow-hidden shadow-2xl shadow-stone-900/10 border-4 border-white shrink-0">
              <img 
                src={`https://picsum.photos/seed/${worker.skill.toLowerCase()}/400/400`} 
                alt={worker.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {worker.skill}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  worker.availability === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                  {worker.availability}
                </span>
              </div>
              <h1 className="text-5xl font-bold text-stone-900">{worker.name}</h1>
              <div className="flex items-center gap-6 text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-stone-900">4.8</span>
                  <span className="text-xs">(124 Reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">{worker.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white border border-stone-200 p-6 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Experience</p>
              <p className="text-xl font-bold text-stone-900">{worker.experience} Years</p>
            </div>
            <div className="bg-white border border-stone-200 p-6 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Hourly Rate</p>
              <p className="text-xl font-bold text-stone-900">${worker.charges}/hr</p>
            </div>
            <div className="bg-white border border-stone-200 p-6 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Completed Jobs</p>
              <p className="text-xl font-bold text-stone-900">450+</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-stone-900">About {worker.name.split(' ')[0]}</h3>
            <p className="text-stone-600 leading-relaxed text-lg">
              Professional {worker.skill.toLowerCase()} with over {worker.experience} years of experience in high-end residential and commercial projects. 
              Specializing in complex installations, repairs, and maintenance. Known for punctuality, clean work environment, and exceptional attention to detail.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Licensed", "Insured", "Background Checked", "Emergency Service"].map(tag => (
                <div key={tag} className="flex items-center gap-1.5 bg-stone-100 text-stone-600 px-4 py-2 rounded-full text-xs font-bold">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="bg-white border border-stone-200 rounded-[32px] p-8 shadow-2xl shadow-stone-900/5 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900">Book Now</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-stone-900">${worker.charges}</span>
                <span className="text-xs text-stone-400">/hr</span>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="date" 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-medium text-stone-700"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <ShieldCheck size={16} />
                  Safe Booking Guarantee
                </div>
                <p className="text-xs text-emerald-600/70 leading-relaxed">
                  Your payment is held securely and only released after the job is completed to your satisfaction.
                </p>
              </div>

              <button 
                type="submit"
                disabled={bookingStatus === 'loading' || worker.availability !== 'Available'}
                className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  worker.availability === 'Available'
                    ? 'bg-stone-900 text-white hover:bg-emerald-600 shadow-stone-900/10'
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
                }`}
              >
                {bookingStatus === 'loading' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : bookingStatus === 'success' ? (
                  <CheckCircle2 size={20} />
                ) : worker.availability === 'Available' ? (
                  "Confirm Booking"
                ) : (
                  "Worker Busy"
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-stone-400">
                  <Phone size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Call</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-stone-400">
                  <Star size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
