import { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, MapPin, SlidersHorizontal, Loader2 } from "lucide-react";
import WorkerCard from "../components/WorkerCard";
import { motion } from "motion/react";

export default function Listing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skill: searchParams.get("skill") || "",
    location: searchParams.get("location") || "",
  });

  const skills = ["Electrician", "Plumber", "Carpenter", "Painter", "Mechanic"];

  useEffect(() => {
    fetchWorkers();
  }, [searchParams]);

  const fetchWorkers = async () => {
    setLoading(true);
    const skill = searchParams.get("skill") || "";
    const location = searchParams.get("location") || "";
    try {
      const res = await fetch(`/api/workers?skill=${skill}&location=${location}`);
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setSearchParams(filters);
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-stone-900">Find Skilled Professionals</h1>
        <p className="text-stone-500">Browse our database of verified tradespersons ready to help with your project.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-[32px] shadow-xl shadow-stone-900/5">
        <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <select 
              className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all appearance-none font-medium text-stone-700"
              value={filters.skill}
              onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
            >
              <option value="">All Skills</option>
              {skills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Location (e.g. New York)"
              className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-medium text-stone-700"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            className="bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
          >
            <SlidersHorizontal size={18} />
            Search Professionals
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400 gap-4">
          <Loader2 size={40} className="animate-spin text-emerald-500" />
          <p className="font-medium uppercase tracking-widest text-xs">Fetching Pros...</p>
        </div>
      ) : workers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {workers.map((worker, i) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <WorkerCard worker={worker} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
          <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
            <Filter size={32} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">No professionals found</h3>
          <p className="text-stone-500">Try adjusting your filters or search terms.</p>
          <button 
            onClick={() => {
              setFilters({ skill: "", location: "" });
              setSearchParams({});
            }}
            className="mt-6 text-emerald-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
