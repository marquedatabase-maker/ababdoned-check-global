import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-100',
    green: 'bg-emerald-500/10 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-100',
    red: 'bg-rose-500/10 text-rose-600 border-rose-100',
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200 group">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 shrink-0",
          colorMap[color] || colorMap.blue
        )}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{title}</p>
          <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight truncate">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
