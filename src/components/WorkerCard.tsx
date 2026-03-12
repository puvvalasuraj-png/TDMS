import { Link } from "react-router-dom";
import { Star, MapPin, Clock, DollarSign } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WorkerCardProps {
  worker: any;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Link 
      to={`/workers/${worker.id}`}
      className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${worker.skill.toLowerCase()}/800/600`} 
          alt={worker.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4">
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm",
            worker.availability === 'Available' 
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          )}>
            {worker.availability}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            {worker.skill}
          </span>
          <div className="flex items-center gap-1 text-stone-400">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-stone-600">4.8</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-stone-900 mb-4 group-hover:text-emerald-600 transition-colors">
          {worker.name}
        </h3>
        
        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <MapPin size={14} />
            <span>{worker.location}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Clock size={14} />
            <span>{worker.experience} Years Exp.</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-stone-900">${worker.charges}</span>
            <span className="text-xs text-stone-400">/hr</span>
          </div>
          <span className="text-xs font-semibold text-emerald-600 group-hover:underline">
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}
