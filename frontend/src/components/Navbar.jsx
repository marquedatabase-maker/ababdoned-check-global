import { useAuth } from '../context/AuthContext';
import { LogOut, Store, Hash } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-100 group transition-all hover:scale-105">
          <Store className="text-white w-4 h-4 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-black text-slate-900 text-sm md:text-base leading-tight tracking-tight">{user?.store_name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[9px] font-black text-primary-600 uppercase tracking-widest">
              <Hash size={9} className="stroke-[3px]" />
              <span>{user?.store_id}</span>
            </div>
            <div className="w-0.5 h-0.5 rounded-full bg-slate-200" />
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Live</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">
          <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary-600 font-black text-xs border border-slate-100">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5 tracking-tighter">Account</span>
            <span className="text-xs font-bold text-slate-700 leading-none">{user?.name}</span>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
