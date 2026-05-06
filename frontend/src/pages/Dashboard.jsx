import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import LeadsTable from '../components/LeadsTable';
import * as XLSX from 'xlsx';
import { Users, ShoppingBag, CheckCircle, AlertCircle, Filter, RefreshCw, BookOpen, List, Code, Copy, Check, Info, ChevronLeft, ChevronRight, Download, FileSpreadsheet } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1, limit: 30 });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', source: '' });
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('leads');
  const [copied, setCopied] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : `${window.location.origin.replace('5173', '5000').replace('5174', '5000').replace('5175', '5000')}`;

  const webhookUrl = `${backendUrl}/webhook/${user?.store_id}`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, analyticsRes] = await Promise.all([
        api.get('/leads', { params: { ...filters, page, limit: 30 } }),
        api.get('/analytics')
      ]);
      setLeads(leadsRes.data.leads || []);
      setPagination(leadsRes.data.pagination || { total: 0, pages: 1, currentPage: 1, limit: 30 });
      setAnalytics(analyticsRes.data || { totalLeads: 0, abandonedCount: 0, convertedCount: 0, lostRevenue: 0 });
    } catch (error) {
      console.error('FETCH ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Reset to page 1 when filters change
  };

  const [exporting, setExporting] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      // Fetch ALL leads with current filters (no pagination limit)
      const res = await api.get('/leads', { params: { ...filters, page: 1, limit: 10000 } });
      const allLeads = res.data.leads || [];

      if (allLeads.length === 0) {
        alert('Koi leads nahi mili export karne ke liye.');
        return;
      }

      // Format data for Excel
      const excelData = allLeads.map((lead, index) => ({
        'S.No': index + 1,
        'Customer Name': lead.name || '-',
        'Email': lead.email || '-',
        'Phone': lead.phone || '-',
        'Address': lead.address || '-',
        'Amount (₹)': lead.amount || 0,
        'Status': lead.status || '-',
        'Source': lead.source || '-',
        'Products': lead.items?.map(i => `${i.title} x${i.quantity}`).join(', ') || '-',
        'Recovery URL': lead.recovery_url || '-',
        'Date': new Date(lead.created_at).toLocaleDateString('en-IN'),
        'Time': new Date(lead.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Auto column widths
      const colWidths = [
        { wch: 5 },   // S.No
        { wch: 20 },  // Name
        { wch: 28 },  // Email
        { wch: 15 },  // Phone
        { wch: 30 },  // Address
        { wch: 12 },  // Amount
        { wch: 12 },  // Status
        { wch: 10 },  // Source
        { wch: 35 },  // Products
        { wch: 35 },  // Recovery URL
        { wch: 12 },  // Date
        { wch: 10 },  // Time
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

      const filterSuffix = filters.status || filters.source ? `_${[filters.status, filters.source].filter(Boolean).join('_')}` : '';
      const fileName = `leads_${user?.store_id || 'export'}${filterSuffix}_${new Date().toISOString().slice(0, 10)}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-1">Dashboard</h2>
            <p className="text-slate-500 font-medium text-xs md:text-sm">Real-time store tracking and recovery metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'leads' && (
              <button 
                onClick={exportToExcel}
                disabled={exporting || loading}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white border border-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                title="Download all leads as Excel"
              >
                {exporting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <FileSpreadsheet size={14} />
                )}
                {exporting ? 'Exporting...' : 'Export Excel'}
              </button>
            )}
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              {loading ? "Syncing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 ">
          <StatsCard title="Total Leads" value={analytics?.totalLeads || 0} icon={Users} color="blue" />
          <StatsCard title="Abandoned" value={analytics?.abandonedCount || 0} icon={AlertCircle} color="orange" />
          <StatsCard title="Converted" value={analytics?.convertedCount || 0} icon={CheckCircle} color="green" />
          <StatsCard title="Revenue Loss" value={`₹${(analytics?.lostRevenue || 0).toLocaleString()}`} icon={ShoppingBag} color="red" />
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex p-1 bg-slate-200/50 rounded-xl w-full md:w-auto shadow-inner">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'leads' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={16} />
              Leads
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab === 'docs' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen size={16} />
              Setup
            </button>
          </div>

          {activeTab === 'leads' && (
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              <div className="flex items-center gap-1.5 text-slate-400 mr-1 shrink-0">
                <Filter size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
              </div>
              <select 
                name="status" 
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 min-w-[120px] shadow-sm" 
                value={filters.status} 
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="abandoned">Abandoned</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
              <select 
                name="source" 
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 min-w-[120px] shadow-sm" 
                value={filters.source} 
                onChange={handleFilterChange}
              >
                <option value="">All Sources</option>
                <option value="shopify">Shopify</option>
                <option value="gokwik">GoKwik</option>
              </select>
            </div>
          )}
        </div>

        {activeTab === 'leads' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-3">
            <LeadsTable leads={leads} loading={loading} />
            
            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to <span className="font-bold text-slate-900">{Math.min(pagination.currentPage * pagination.limit, pagination.total)}</span> of <span className="font-bold text-slate-900">{pagination.total}</span> leads
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1 || loading}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      // Simple pagination logic for 5 pages around current
                      let pageNum = pagination.currentPage;
                      if (pagination.pages <= 5) pageNum = i + 1;
                      else if (pagination.currentPage <= 3) pageNum = i + 1;
                      else if (pagination.currentPage >= pagination.pages - 2) pageNum = pagination.pages - 4 + i;
                      else pageNum = pagination.currentPage - 2 + i;

                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${pagination.currentPage === pageNum ? 'bg-primary-600 text-white shadow-md shadow-primary-100' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                    disabled={page === pagination.pages || loading}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-5 md:p-7 rounded-[28px] border border-slate-100 shadow-sm max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              <div className="bg-primary-600 p-2.5 rounded-[16px] text-white shadow-lg shadow-primary-100">
                <Code size={24} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight mb-0.5">Integration Guide</h3>
                <p className="text-slate-500 font-medium text-xs md:text-sm">Connect your store in minutes and start tracking.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="relative pl-8 border-l-2 border-slate-100">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-600 border-[3px] border-white shadow-sm"></div>
                <h4 className="font-semibold text-slate-900 text-base mb-1.5">Copy Webhook URL</h4>
                <p className="text-slate-500 mb-3 text-xs md:text-[13px] leading-relaxed max-w-2xl font-medium">
                  Use this unique URL in your Shopify or GoKwik webhook settings. It's already linked to your store.
                </p>
                <div className="bg-slate-900 p-3.5 rounded-[16px] relative group overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Info size={24} className="text-white" />
                  </div>
                  <code className="text-emerald-400 text-[9px] md:text-xs font-mono break-all pr-12 block py-0.5">
                    {webhookUrl}
                  </code>
                  <button 
                    onClick={copyToClipboard}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-8 border-l-2 border-slate-100">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-600 border-[3px] border-white shadow-sm"></div>
                <h4 className="font-semibold text-slate-900 text-base mb-4">Configure Platforms</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-[20px] border border-slate-100 hover:border-primary-200 transition-all group">
                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-semibold text-emerald-500">S</span>
                    </div>
                    <h5 className="font-semibold text-slate-900 mb-1 text-xs md:text-sm">Shopify Setup</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Settings &rarr; Notifications &rarr; Webhooks. Add <span className="font-semibold">"Checkout Creation"</span> and <span className="font-semibold">"Order Creation"</span>.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-[20px] border border-slate-100 hover:border-primary-200 transition-all group">
                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <span className="text-sm font-semibold text-blue-500">G</span>
                    </div>
                    <h5 className="font-semibold text-slate-900 mb-1 text-xs md:text-sm">GoKwik Setup</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Paste the URL in your GoKwik Dashboard. No extra Merchant ID needed, the URL handles it.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary-50/50 rounded-[20px] border border-primary-100/50 flex gap-3 items-start">
                <div className="bg-primary-100 p-1.5 rounded-lg text-primary-600 shrink-0">
                  <AlertCircle size={16} />
                </div>
                <p className="text-primary-900 text-[11px] leading-relaxed font-medium">
                  <span className="font-semibold">Pro Tip:</span> If testing locally, use <span className="font-semibold">ngrok</span> to expose your localhost port 5000 and use that URL instead.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
