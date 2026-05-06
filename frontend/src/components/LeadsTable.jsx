import React from 'react';
import { Mail, Phone, MessageSquare, MapPin, ExternalLink, Package, ShoppingCart, Calendar, Clock, Globe } from 'lucide-react';

const LeadsTable = ({ leads, loading }) => {
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
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white rounded-xl border border-slate-100 shadow-sm px-3 py-2.5">
            
            {/* Row 1: Avatar + Name + Status + Amount */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-[11px] border border-slate-200 shrink-0">
                {lead.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800 text-[12px] truncate leading-tight">{lead.name}</span>
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
            </div>

            {/* Row 3: Email + Address side by side */}
            {(lead.email || lead.address) && (
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 mb-1.5 min-w-0">
                {lead.email && (
                  <>
                    <Mail size={9} className="text-slate-300 shrink-0" />
                    <span className="truncate max-w-[120px]">{lead.email}</span>
                  </>
                )}
                {lead.email && lead.address && (
                  <span className="text-slate-200 shrink-0">·</span>
                )}
                {lead.address && (
                  <>
                    <MapPin size={9} className="text-slate-300 shrink-0" />
                    <span className="truncate">{lead.address}</span>
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
              <div className="flex items-center gap-1 text-[8px] text-slate-400 font-normal">
                <Calendar size={8} />
                <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                <span className="text-slate-300 mx-0.5">·</span>
                <Clock size={8} />
                <span>{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex gap-1.5">
                <a 
                  href={formatWhatsAppUrl(lead.phone, lead.name, lead.items, lead.recovery_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-sm"
                >
                  <MessageSquare size={12} />
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
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100">Customer</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100">Contact & Info</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100">Products</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 text-right">Amount</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100">Date</th>
              <th className="px-4 py-2.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase border border-slate-200 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 text-[13px]">{lead.name}</span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-primary-600 uppercase">
                        <Globe size={9} />
                        {lead.source}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                      <Phone size={12} className="text-slate-400" />
                      {lead.phone}
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                        <Mail size={10} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{lead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] leading-none">
                      <MapPin size={10} className="shrink-0" />
                      <span className="truncate max-w-[150px]">{lead.address || 'No Address'}</span>
                    </div>
                  </div>
                </td>
                {/* Products Column */}
                <td className="px-4 py-2.5 max-w-[200px]">
                  {lead.items && lead.items.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {lead.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Package size={9} className="text-slate-300 shrink-0" />
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-semibold text-primary-600 hover:text-primary-700 hover:underline truncate max-w-[150px] flex items-center gap-1"
                            >
                              <span className="truncate">{item.title}</span>
                              <ExternalLink size={8} className="shrink-0" />
                            </a>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-700 truncate max-w-[150px]">{item.title}</span>
                          )}
                          <span className="text-[9px] text-slate-400 font-bold shrink-0">×{item.quantity}</span>
                        </div>
                      ))}
                      {lead.items.length > 3 && (
                        <span className="text-[9px] text-slate-400 font-semibold">+{lead.items.length - 3} more</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300 font-semibold">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className="font-bold text-slate-900 text-sm">₹{lead.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                    lead.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    lead.status === 'abandoned' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <a 
                      href={formatWhatsAppUrl(lead.phone, lead.name, lead.items, lead.recovery_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-sm"
                      title="WhatsApp"
                    >
                      <MessageSquare size={14} />
                    </a>
                    {lead.recovery_url && (
                      <a 
                        href={lead.recovery_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-sm"
                        title="View Cart"
                      >
                        <ShoppingCart size={14} />
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
