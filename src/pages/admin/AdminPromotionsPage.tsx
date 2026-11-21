import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { Promotion } from '../../types';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Percent, 
  DollarSign, 
  Truck,
  Sparkles,
  Flame
} from 'lucide-react';

export const AdminPromotionsPage: React.FC = () => {
  const { 
    promotions, 
    createPromotion, 
    togglePromotionActive, 
    deletePromotion,
    addToast 
  } = useCommerceStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount' | 'free_shipping'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minimumSpend, setMinimumSpend] = useState(100);
  const [usageLimit, setUsageLimit] = useState(500);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    createPromotion({
      code: code.trim().toUpperCase(),
      title,
      description,
      discountType,
      discountValue: Number(discountValue),
      minimumSpend: Number(minimumSpend),
      applicableCategory: 'all',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 60).toISOString(),
      usageLimit: Number(usageLimit),
      isActive: true,
    });

    setCreateModalOpen(false);
    setCode('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Marketing & Discount Engine
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Promotions & Coupons
          </h1>
          <p className="text-xs text-muted">
            Configure percentage discounts, coupon codes, and shipping promotions. Changes apply instantly to cart and checkout.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promotion</span>
        </button>
      </div>

      {/* Promotions List Table */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone/40 border-b border-delicate text-muted font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Type & Benefit</th>
                <th className="py-3 px-4">Min. Spend</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Active Toggle</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-b border-delicate/40 hover:bg-stone/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-forest">
                    {promo.code}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-charcoal">{promo.title}</p>
                    <p className="text-[11px] text-muted">{promo.description}</p>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-charcoal">
                      {promo.discountType === 'percentage' 
                        ? `${promo.discountValue}% Off` 
                        : promo.discountType === 'fixed_amount' 
                        ? `$${promo.discountValue} Off` 
                        : 'Free Shipping'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {promo.minimumSpend ? `$${promo.minimumSpend}` : 'None'}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted">
                    {promo.timesUsed} / {promo.usageLimit || '∞'}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => togglePromotionActive(promo.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-colors ${
                        promo.isActive
                          ? 'bg-forest/15 text-forest hover:bg-forest/25'
                          : 'bg-stone text-muted hover:bg-stone/80'
                      }`}
                    >
                      {promo.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="p-1 text-muted hover:text-error transition-colors"
                      title="Delete promotion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CREATE PROMOTION MODAL ================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full bg-white border border-delicate rounded-card shadow-dropdown p-6 text-charcoal relative space-y-4">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-serif text-xl font-bold">Create New Promotion</h2>
            <p className="text-xs text-muted">
              Discount will be available to customers at cart and checkout.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Coupon Code (e.g. SPRING25)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="PROMOCODE"
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs uppercase font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VIP Seasonal Courtesy"
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed_amount">Fixed Amount Discount ($)</option>
                  <option value="free_shipping">Free Expedited Shipping</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Min. Order Spend ($)</label>
                  <input
                    type="number"
                    value={minimumSpend}
                    onChange={(e) => setMinimumSpend(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Customer Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of terms..."
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                />
              </div>

              <div className="pt-4 border-t border-delicate flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-delicate rounded-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest text-white rounded-button text-xs font-semibold shadow-subtle"
                >
                  Activate Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
