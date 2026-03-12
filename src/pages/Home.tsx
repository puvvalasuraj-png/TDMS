import { Link } from "react-router-dom";
import { Hammer, Shield, Zap, Clock, ArrowRight, Star } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const categories = [
    { name: "Electrician", icon: <Zap size={24} />, count: 12 },
    { name: "Plumber", icon: <Hammer size={24} />, count: 8 },
    { name: "Carpenter", icon: <Hammer size={24} />, count: 15 },
    { name: "Painter", icon: <Hammer size={24} />, count: 6 },
    { name: "Mechanic", icon: <Hammer size={24} />, count: 10 },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-50/50 -z-10 rounded-3xl"></div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
              <Star size={14} className="fill-emerald-600" />
              Trusted by 5,000+ Homeowners
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.1] tracking-tight">
              Find Skilled <span className="text-emerald-600 italic serif">Tradespersons</span> in Seconds.
            </h1>
            <p className="text-xl text-stone-600 max-w-lg leading-relaxed">
              The most reliable database management system for booking professional electricians, plumbers, and more.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/workers" 
                className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-stone-900/10 flex items-center gap-2 group"
              >
                Find a Pro
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/auth" 
                className="bg-white text-stone-900 border border-stone-200 px-8 py-4 rounded-full font-bold hover:bg-stone-50 transition-all shadow-sm"
              >
                Register Now
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10">
              <img 
                src="https://picsum.photos/seed/construction/1200/1500" 
                alt="Skilled Worker" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 max-w-[240px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Verified Pro</p>
                  <p className="font-bold text-stone-900">100% Guaranteed</p>
                </div>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">All our tradespersons are background checked and verified.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-12">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Categories</h2>
            <h3 className="text-4xl font-bold text-stone-900">What are you looking for?</h3>
          </div>
          <Link to="/workers" className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 group">
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <Link 
              key={cat.name}
              to={`/workers?skill=${cat.name}`}
              className="group bg-white border border-stone-200 p-8 rounded-2xl hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-center"
            >
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all mb-6 mx-auto">
                {cat.icon}
              </div>
              <h4 className="font-bold text-stone-900 mb-1">{cat.name}</h4>
              <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">{cat.count} Pros</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-stone-900 rounded-[40px] p-12 lg:p-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full"></div>
        <div className="grid lg:grid-cols-2 gap-24 relative z-10">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold leading-tight">Why choose our <span className="text-emerald-500">TDMS</span> platform?</h2>
            <p className="text-stone-400 text-lg leading-relaxed">
              We bridge the gap between skilled tradespersons and homeowners, providing a seamless booking experience with verified professionals.
            </p>
            <div className="grid sm:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <h4 className="font-bold text-xl">Verified Skills</h4>
                <p className="text-stone-500 text-sm leading-relaxed">Every worker's experience and skills are thoroughly vetted by our team.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <h4 className="font-bold text-xl">Real-time Status</h4>
                <p className="text-stone-500 text-sm leading-relaxed">Check worker availability instantly and book without the back-and-forth.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-stone-800/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 lg:p-12 space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Testimonial</p>
              <h3 className="text-3xl font-bold italic serif">"The easiest way to find a reliable plumber I've ever used."</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500/20">
                <img src="https://picsum.photos/seed/avatar1/100/100" alt="User" />
              </div>
              <div>
                <p className="font-bold">David Miller</p>
                <p className="text-xs text-stone-500 uppercase tracking-widest">Homeowner in NY</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
