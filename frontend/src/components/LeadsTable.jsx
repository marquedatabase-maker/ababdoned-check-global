import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, ExternalLink, Package, ShoppingCart, Calendar, Clock, Globe, Copy, Check } from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const LeadsTable = ({ leads, loading, pagination }) => {
  const [copiedPhone, setCopiedPhone] = useState(null);

  const getSerialNumber = (index) => {
    if (!pagination) return index + 1;
    return (pagination.currentPage - 1) * pagination.limit + index + 1;
  };

  const isValidAddress = (addr) => {
    if (!addr) return false;
    const clean = addr.replace(/[, \-\.]/g, '').trim();
    return clean.length > 0 && clean.toLowerCase() !== 'noaddress' && clean.toLowerCase() !== 'noaddressprovided';
  };

  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-full" />
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                  <div className="h-2 w-28 bg-slate-50 rounded" />
                </div>
              </div>
              <div className="h-5 w-12 bg-slate-100 rounded-full" />
            </div>
            <div className="h-8 w-full bg-slate-50 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  const formatWhatsAppUrl = (phone, name, items = [], recoveryUrl) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const productNames = items.map(item => `${item.quantity}x ${item.title}`).join(', ');
    
    let messageText = `Hi ${name}, saw you left ${productNames || 'items'} in your cart. `;
    if (recoveryUrl) {
      messageText += `You can complete your order here: ${recoveryUrl}`;
    } else {
      messageText += `Would you like to complete your order?`;
    }
    
    const message = encodeURIComponent(messageText);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };
  if (leads.length === 0) {
    return (
      <div className="bg-white py-12 px-6 rounded-3xl border border-slate-100 shadow-sm text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-50 rounded-full mb-3">
          <ShoppingCart size={24} className="text-slate-300" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No leads found</h3>
        <p className="text-slate-500 text-xs max-w-xs mx-auto">
          We haven't received any webhook data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile Card View — Ultra Compact */}
      <div className="grid grid-cols-1 gap-2 md:hidden">
        {leads.map((lead, idx) => (
          <div key={lead._id} className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-2.5 relative overflow-hidden hover:shadow-md hover:border-primary-200 hover:bg-slate-50 transition-all duration-300 group">
            
            {/* Row 1: Avatar + Name + Status + Amount */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="relative group-hover:scale-105 transition-transform duration-300">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-[11px] border border-slate-200 shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                  {lead.name.charAt(0)}
                </div>
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-slate-800 text-white rounded-full flex items-center justify-center text-[7px] font-bold shadow-sm">
                  {getSerialNumber(idx)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 text-[12px] truncate leading-tight group-hover:text-primary-700 transition-colors">{lead.name}</span>
                  <span className="font-semibold text-slate-700 text-[11px] shrink-0">₹{lead.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1 text-[8px] font-medium uppercase text-primary-500">
                    <Globe size={8} />
                    {lead.source}
                  </div>
                  <span className={`px-1.5 py-0 rounded-full text-[7px] font-medium uppercase tracking-tight border ${
                    lead.status === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    lead.status === 'abandoned' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Phone */}
            <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium mb-1">
              <Phone size={9} className="text-slate-400" />
              {lead.phone}
              <button 
                onClick={() => handleCopyPhone(lead.phone)} 
                className="ml-1 text-slate-400 hover:text-primary-600 transition-colors"
                title="Copy Number"
              >
                {copiedPhone === lead.phone ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
              </button>
            </div>

            {/* Row 3: Email + Address side by side */}
            {(lead.email || isValidAddress(lead.address)) && (
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mb-1.5 min-w-0">
                {lead.email && (
                  <>
                    <Mail size={9} className="text-slate-300 shrink-0" />
                    <span className="truncate max-w-[120px]">{lead.email}</span>
                  </>
                )}
                {lead.email && isValidAddress(lead.address) && (
                  <span className="text-slate-200 shrink-0">·</span>
                )}
                {isValidAddress(lead.address) && (
                  <>
                    <MapPin size={9} className="text-slate-300 shrink-0 mt-0.5" />
                    <span className="whitespace-normal leading-tight">{lead.address}</span>
                  </>
                )}
              </div>
            )}

            {/* Row 4: Products */}
            {lead.items && lead.items.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {lead.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded-md text-[8px] text-slate-500 font-medium">
                    <Package size={8} className="text-slate-300 shrink-0" />
                    <span className="truncate max-w-[90px]">{item.title}</span>
                    <span className="text-primary-400">×{item.quantity}</span>
                  </div>
                ))}
                {lead.items.length > 2 && (
                  <span className="text-[8px] text-slate-400 font-medium self-center">+{lead.items.length - 2}</span>
                )}
              </div>
            )}

            {/* Row 5: Date + Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-bold">
                <Calendar size={10} className="text-slate-500" />
                <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                <span className="text-slate-300 mx-0.5 font-normal">·</span>
                <Clock size={10} className="text-slate-500" />
                <span>{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex gap-1.5">
                <a 
                  href={formatWhatsAppUrl(lead.phone, lead.name, lead.items, lead.recovery_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-sm"
                >
                  <WhatsAppIcon className="w-3 h-3" />
                </a>
                {lead.recovery_url && (
                  <a 
                    href={lead.recovery_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-primary-600 text-white rounded-lg shadow-sm"
                  >
                    <ShoppingCart size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 w-12 text-center">#</th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 w-[180px]">Customer</th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 min-w-[240px]">Contact & Info</th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 min-w-[220px]">Products</th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 text-right">Amount</th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100">Date</th>
              <th className="px-5 py-4 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead, idx) => (
              <tr key={lead._id} className="hover:bg-slate-100 transition-all duration-300 group cursor-default">
                <td className="px-5 py-4 text-center align-top">
                  <span className="text-[12px] font-bold text-slate-400 mt-1 block">{getSerialNumber(idx)}</span>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase border border-slate-200 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-200 group-hover:shadow-sm group-hover:scale-110 transition-all duration-300 shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <span className="font-bold text-slate-800 text-[13px] leading-tight group-hover:text-primary-700 transition-colors">{lead.name}</span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-primary-600 uppercase mt-1">
                        <Globe size={10} />
                        {lead.source}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-700 text-[13px] font-bold">
                      <Phone size={13} className="text-slate-400" />
                      {lead.phone}
                      <button 
                        onClick={() => handleCopyPhone(lead.phone)} 
                        className="ml-1 text-slate-400 hover:text-primary-600 transition-colors" 
                        title="Copy Number"
                      >
                        {copiedPhone === lead.phone ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{lead.email}</span>
                      </div>
                    )}
                    {isValidAddress(lead.address) && (
                      <div className="flex items-start gap-2 text-slate-600 text-[11px] leading-relaxed mt-2">
                        <MapPin size={13} className="shrink-0 text-slate-400 mt-0.5" />
                        <span className="whitespace-normal max-w-[280px]">{lead.address}</span>
                      </div>
                    )}
                  </div>
                </td>
                {/* Products Column */}
                <td className="px-5 py-4 align-top">
                  {lead.items && lead.items.length > 0 ? (
                    <div className="flex flex-col gap-1.5 pt-0.5">
                      {lead.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 w-full">
                          <Package size={12} className="text-slate-300 shrink-0" />
                          <span className="text-[10px] text-slate-400 font-bold shrink-0">{item.quantity}x</span>
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1 truncate"
                            >
                              <span className="truncate max-w-[150px]">{item.title}</span>
                              <ExternalLink size={10} className="shrink-0" />
                            </a>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">{item.title}</span>
                          )}
                        </div>
                      ))}
                      {lead.items.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-bold mt-1 ml-5">+{lead.items.length - 3} more items</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right align-top pt-5">
                  <span className="font-black text-slate-900 text-[15px]">₹{lead.amount.toLocaleString()}</span>
                </td>
                <td className="px-5 py-4 text-center align-top pt-5">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    lead.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    lead.status === 'abandoned' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-5 py-4 align-top pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-black text-slate-800">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">
                      {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 align-top pt-4">
                  <div className="flex items-center justify-center gap-2">
                    <a 
                      href={formatWhatsAppUrl(lead.phone, lead.name, lead.items, lead.recovery_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-emerald-200"
                      title="WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                    </a>
                    {lead.recovery_url && (
                      <a 
                        href={lead.recovery_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-primary-200"
                        title="View Cart"
                      >
                        <ShoppingCart size={16} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
