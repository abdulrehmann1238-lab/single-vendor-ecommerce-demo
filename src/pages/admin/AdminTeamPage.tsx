import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { StaffMember } from '../../types';
import { 
  ShieldCheck, 
  Plus, 
  Check, 
  X, 
  Mail, 
  Key, 
  Lock,
  UserPlus
} from 'lucide-react';

export const AdminTeamPage: React.FC = () => {
  const { staff, inviteStaff, updateStaffPermissions, addToast } = useCommerceStore();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Invite Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Order Manager');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    inviteStaff({
      name,
      email,
      role,
      status: 'invited',
      permissions: {
        products: role === 'Administrator' || role === 'Inventory Manager' || role === 'Marketing Manager',
        inventory: role === 'Administrator' || role === 'Inventory Manager' || role === 'Order Manager',
        orders: role === 'Administrator' || role === 'Order Manager' || role === 'Customer Support',
        promotions: role === 'Administrator' || role === 'Marketing Manager',
        customers: role === 'Administrator' || role === 'Order Manager' || role === 'Customer Support',
        analytics: role === 'Administrator' || role === 'Marketing Manager',
        settings: role === 'Administrator',
      },
    });

    setInviteModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Internal Operations Governance
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Team & Role-Based Permissions (RBAC)
          </h1>
          <p className="text-xs text-muted">
            Manage internal staff access levels across inventory, catalog publishing, and customer orders.
          </p>
        </div>

        <button
          onClick={() => setInviteModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      {/* Staff Members List */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-delicate">
          <h2 className="font-serif text-lg font-bold text-charcoal">
            Active Staff Directory ({staff.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone/40 border-b border-delicate text-muted font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Access Scope</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-b border-delicate/40 hover:bg-stone/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-charcoal flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-charcoal text-white text-[10px] flex items-center justify-center font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p>{member.name}</p>
                      <p className="text-[10px] text-muted font-mono">{member.email}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 bg-stone rounded text-xs font-semibold text-charcoal">
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono font-bold uppercase text-forest bg-forest/10 px-2 py-0.5 rounded">
                      {member.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-muted font-mono">
                    {member.lastActive}
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-muted font-mono">
                    {Object.entries(member.permissions).filter(([_, v]) => v).map(([k]) => k).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
        <div className="pb-3 border-b border-delicate">
          <h2 className="font-serif text-lg font-bold text-charcoal">
            Role-Based Access Control (RBAC) Matrix
          </h2>
          <p className="text-xs text-muted">Functional boundaries enforced across the internal software layers.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-delicate text-muted font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Catalog</th>
                <th className="py-2.5 px-3">Inventory</th>
                <th className="py-2.5 px-3">Orders</th>
                <th className="py-2.5 px-3">Promotions</th>
                <th className="py-2.5 px-3">Customers</th>
                <th className="py-2.5 px-3">Analytics</th>
                <th className="py-2.5 px-3">Settings</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'Owner', all: true },
                { role: 'Administrator', all: true },
                { role: 'Inventory Manager', cat: true, inv: true, ord: true, an: true },
                { role: 'Order Manager', inv: true, ord: true, cust: true },
                { role: 'Marketing Manager', cat: true, promo: true, cust: true, an: true },
                { role: 'Customer Support', ord: true, cust: true },
              ].map((r, idx) => (
                <tr key={idx} className="border-b border-delicate/40">
                  <td className="py-2.5 px-3 font-bold text-charcoal">{r.role}</td>
                  <td className="py-2.5 px-3">{r.all || r.cat ? <Check className="w-4 h-4 text-forest" /> : '—'}</td>
                  <td className="py-2.5 px-3">{r.all || r.inv ? <Check className="w-4 h-4 text-forest" /> : '—'}</td>
                  <td className="py-2.5 px-3">{r.all || r.ord ? <Check className="w-4 h-4 text-forest" /> : '—'}</td>
                  <td className="py-2.5 px-3">{r.all || r.promo ? <Check className="w-4 h-4 text-forest" /> : '—'}</td>
                  <td className="py-2.5 px-3">{r.all || r.cust ? <Check className="w-4 h-4 text-forest" /> : '—'}</td>
                  <td className="py-2.5 px-3">{r.all || r.an ? <Check className="w-4 h-4 text-forest" /> : '—'}</td>
                  <td className="py-2.5 px-3">{r.all ? <Check className="w-4 h-4 text-forest" /> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full bg-white border border-delicate rounded-card shadow-dropdown p-6 text-charcoal relative space-y-4">
            <button onClick={() => setInviteModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-xl font-bold">Invite Staff Member</h2>
            <p className="text-xs text-muted">Grant operational access to internal administration tools.</p>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liam Gallagher"
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="liam@atelier-commerce.com"
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Order Manager">Order Manager</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 border border-delicate rounded-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest text-white rounded-button text-xs font-semibold shadow-subtle"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
