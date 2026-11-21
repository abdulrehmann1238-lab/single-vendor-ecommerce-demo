import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  Settings, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Globe, 
  Database,
  Lock,
  Check
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { resetAllDemoData, addToast } = useCommerceStore();

  const [storeName, setStoreName] = useState('ATELIER & CO.');
  const [supportEmail, setSupportEmail] = useState('concierge@atelier-commerce.com');
  const [currency, setCurrency] = useState('USD ($)');
  const [taxRate, setTaxRate] = useState(8.25);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(150);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      description: 'Store parameters and regional tax rules updated.',
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all catalog, inventory, order, and promotion data to original factory demonstration defaults?')) {
      resetAllDemoData();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
          Platform Configuration
        </span>
        <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
          Store Infrastructure Settings
        </h1>
        <p className="text-xs text-muted">
          Configure currencies, freight thresholds, sales tax rules, and demonstration state.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* General Store Information */}
        <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
          <div className="pb-3 border-b border-delicate">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              General Identity & Support
            </h2>
            <p className="text-xs text-muted">Brand naming and communication contact displayed to customers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium mb-1">Brand Legal Title</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Support Concierge Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
              >
                <option value="USD ($)">United States Dollar (USD $)</option>
                <option value="EUR (€)">Euro (EUR €)</option>
                <option value="GBP (£)">British Pound (GBP £)</option>
                <option value="SEK (kr)">Swedish Krona (SEK kr)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Standard Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Fulfillment Rules */}
        <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
          <div className="pb-3 border-b border-delicate">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              Freight & Delivery Rules
            </h2>
            <p className="text-xs text-muted">Simulated logistics and threshold policies.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium mb-1">Complimentary Courier Threshold ($)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Default Ground Carrier</label>
              <input
                type="text"
                defaultValue="DHL Express / FedEx Ground"
                disabled
                className="w-full p-2.5 bg-stone/50 border border-delicate rounded text-xs text-muted"
              />
            </div>
          </div>
        </div>

        {/* Demo Data Management */}
        <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
          <div className="pb-3 border-b border-delicate">
            <h2 className="font-serif text-lg font-bold text-error">
              Demonstration State Management
            </h2>
            <p className="text-xs text-muted">
              Reset all catalog edits, inventory adjustments, placed orders, and promotions back to original factory presets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-error/5 border border-error/20 rounded-card">
            <div>
              <h3 className="text-xs font-bold text-error">Reset All Demo Data</h3>
              <p className="text-[11px] text-muted mt-0.5">
                Restores the 36 products, 15 initial orders, 20 customers, and 5 promotions.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center gap-1.5 px-4 py-2 bg-error hover:bg-error/90 text-white rounded-button text-xs font-semibold shadow-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

    </div>
  );
};
