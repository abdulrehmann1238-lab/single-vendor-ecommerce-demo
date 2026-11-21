import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { CustomerProfile } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Download,
  X,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCustomersPage: React.FC = () => {
  const { customers, orders, addToast } = useCommerceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const handleExportCustomers = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Status', 'Registered Date'];
    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.phone}"`,
      c.totalOrders,
      c.totalSpent,
      c.status,
      c.registeredDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `atelier_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Customer Data Exported',
      description: `${filteredCustomers.length} client records downloaded as CSV.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Customer Relationship Infrastructure
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Clientele & Patrons
          </h1>
          <p className="text-xs text-muted">
            Inspect purchase histories, lifetime value, delivery addresses, and customer profiles.
          </p>
        </div>

        <button
          onClick={handleExportCustomers}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-delicate hover:bg-stone text-charcoal rounded-button text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-muted" />
          <span>Export Client List</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name or email..."
            className="w-full pl-9 pr-3 py-2 bg-stone/40 border border-delicate rounded-button text-xs outline-none focus:border-forest"
          />
        </div>

        <div className="text-xs text-muted font-mono">
          {filteredCustomers.length} active client profiles
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone/40 border-b border-delicate text-muted font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="border-b border-delicate/40 hover:bg-stone/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-charcoal">
                    {cust.name}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted">
                    <p className="text-charcoal">{cust.email}</p>
                    <p className="text-[10px]">{cust.phone}</p>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted">
                    {cust.registeredDate}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                    {cust.totalOrders}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                    ${cust.totalSpent.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      cust.status === 'vip' ? 'bg-champagne/20 text-champagne-dark' : 'bg-forest/15 text-forest'
                    }`}>
                      {cust.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1 bg-stone hover:bg-delicate text-charcoal rounded text-xs font-semibold transition-colors"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-xl w-full bg-white border border-delicate rounded-card shadow-dropdown p-6 text-charcoal relative space-y-5">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-delicate">
              <div className="w-12 h-12 rounded-full bg-forest text-white font-serif text-xl flex items-center justify-center font-bold">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">{selectedCustomer.name}</h2>
                <p className="text-xs text-muted font-mono">{selectedCustomer.email} • {selectedCustomer.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-stone/40 rounded border border-delicate">
                <span className="text-[10px] text-muted block uppercase">Lifetime GMV</span>
                <span className="font-bold text-base text-charcoal">${selectedCustomer.totalSpent.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-stone/40 rounded border border-delicate">
                <span className="text-[10px] text-muted block uppercase">Completed Orders</span>
                <span className="font-bold text-base text-charcoal">{selectedCustomer.totalOrders}</span>
              </div>
            </div>

            {selectedCustomer.addresses.length > 0 && (
              <div className="text-xs space-y-1">
                <span className="font-mono text-muted uppercase font-bold text-[10px]">Primary Coordinates</span>
                <p className="font-medium text-charcoal">{selectedCustomer.addresses[0].addressLine1} {selectedCustomer.addresses[0].addressLine2}</p>
                <p className="text-muted">{selectedCustomer.addresses[0].city}, {selectedCustomer.addresses[0].state} {selectedCustomer.addresses[0].postalCode}, {selectedCustomer.addresses[0].country}</p>
              </div>
            )}

            {selectedCustomer.notes && (
              <div className="p-3 bg-stone/20 rounded border border-delicate text-xs">
                <span className="font-bold text-charcoal block mb-0.5">Concierge Notes:</span>
                <p className="text-muted">{selectedCustomer.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-charcoal text-white rounded text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
