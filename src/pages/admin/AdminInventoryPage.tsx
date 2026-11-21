import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { InventoryRecord } from '../../types';
import { 
  Boxes, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Plus, 
  Minus, 
  X,
  Building,
  History,
  ArrowRight
} from 'lucide-react';

export const AdminInventoryPage: React.FC = () => {
  const { 
    inventory, 
    stockAdjustments, 
    adjustStock, 
    addToast 
  } = useCommerceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');

  // Adjust Stock Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('wh-main');
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(10);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'reconcile'>('add');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Supplier Shipment Receipt');
  const [adjustmentNotes, setAdjustmentNotes] = useState<string>('');

  // Total Stock Units
  const totalStockUnits = inventory.reduce((sum, item) => sum + item.totalAvailable, 0);
  const lowStockCount = inventory.filter((i) => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'out_of_stock').length;

  // Filter inventory items
  const filteredInventory = inventory.filter((item) => {
    if (stockStatusFilter !== 'all' && item.status !== stockStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdjust = (prodId?: string) => {
    setSelectedProductId(prodId || inventory[0]?.productId || '');
    setSelectedWarehouseId('wh-main');
    setAdjustmentDelta(15);
    setAdjustmentType('add');
    setAdjustmentReason('Supplier Shipment Inbound');
    setAdjustmentNotes('');
    setAdjustModalOpen(true);
  };

  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const delta = adjustmentType === 'remove' ? -Math.abs(adjustmentDelta) : Math.abs(adjustmentDelta);
    adjustStock(
      selectedProductId,
      selectedWarehouseId,
      delta,
      adjustmentType,
      adjustmentReason,
      adjustmentNotes
    );

    setAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Warehouse Logistics & Fulfillment Engine
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Multi-Warehouse Inventory
          </h1>
          <p className="text-xs text-muted">
            Track available, reserved, and incoming stock across Chicago Central, Pacific, and Atlantic hubs.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdjust()}
          className="flex items-center gap-1.5 px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adjust Stock Levels</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">Total Stock Units</span>
          <div className="text-2xl font-bold font-mono text-charcoal">
            {totalStockUnits.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted font-mono">Across 3 physical hubs</p>
        </div>

        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">Active SKUs</span>
          <div className="text-2xl font-bold font-mono text-charcoal">
            {inventory.length}
          </div>
          <p className="text-[10px] text-forest font-medium">100% synchronized</p>
        </div>

        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">Low Stock Warnings</span>
          <div className="text-2xl font-bold font-mono text-warning">
            {lowStockCount}
          </div>
          <p className="text-[10px] text-muted">Below reorder threshold</p>
        </div>

        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-1">
          <span className="text-[10px] font-mono uppercase text-muted">Out of Stock</span>
          <div className="text-2xl font-bold font-mono text-error">
            {outOfStockCount}
          </div>
          <p className="text-[10px] text-muted">Storefront shows backorder</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or SKU..."
              className="w-full pl-9 pr-3 py-2 bg-stone/40 border border-delicate rounded-button text-xs outline-none focus:border-forest"
            />
          </div>

          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="p-2 bg-stone/40 border border-delicate rounded-button text-xs text-charcoal outline-none cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock Only</option>
            <option value="low_stock">Low Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        <div className="text-xs text-muted font-mono">
          Showing {filteredInventory.length} inventory records
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone/40 border-b border-delicate text-muted font-mono uppercase text-[10px]">
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Central Hub (Chicago)</th>
                <th className="py-3 px-4">Pacific Coast (Reno)</th>
                <th className="py-3 px-4">Atlantic (PA)</th>
                <th className="py-3 px-4">Total Available</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.productId} className="border-b border-delicate/40 hover:bg-stone/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-charcoal">{item.productName}</p>
                    <p className="text-[10px] text-muted font-mono">SKU: {item.sku} • Reorder at: {item.reorderThreshold}</p>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-charcoal">{item.warehouses[0]?.quantity || 0}</span>
                    <span className="text-[10px] text-muted block">({item.warehouses[0]?.reserved || 0} reserved)</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-charcoal">{item.warehouses[1]?.quantity || 0}</span>
                    <span className="text-[10px] text-muted block">({item.warehouses[1]?.reserved || 0} reserved)</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-charcoal">{item.warehouses[2]?.quantity || 0}</span>
                    <span className="text-[10px] text-muted block">({item.warehouses[2]?.reserved || 0} reserved)</span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-sm text-charcoal">{item.totalAvailable}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.status === 'in_stock'
                        ? 'bg-forest/15 text-forest'
                        : item.status === 'low_stock'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-error/15 text-error'
                    }`}>
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenAdjust(item.productId)}
                      className="px-3 py-1 bg-stone hover:bg-delicate text-charcoal rounded text-xs font-semibold transition-colors"
                    >
                      Adjust →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Movement Audit Trail */}
      {stockAdjustments.length > 0 && (
        <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-delicate">
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Recent Inventory Movement Audit Logs
            </h3>
            <span className="text-xs text-muted font-mono">{stockAdjustments.length} recorded events</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {stockAdjustments.map((entry) => (
              <div key={entry.id} className="p-2.5 bg-stone/20 rounded border border-delicate/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-charcoal">{entry.productName}</span>
                  <span className="text-muted ml-2 font-mono text-[11px]">({entry.warehouseName})</span>
                  <p className="text-[11px] text-muted mt-0.5">
                    Reason: {entry.reason} • Adjusted by {entry.performedBy}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className={`font-bold text-sm ${entry.quantityDelta > 0 ? 'text-forest' : 'text-error'}`}>
                    {entry.quantityDelta > 0 ? `+${entry.quantityDelta}` : entry.quantityDelta}
                  </span>
                  <span className="block text-[10px] text-muted">
                    {entry.previousQuantity} → {entry.newQuantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ADJUST STOCK MODAL ================= */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full bg-white border border-delicate rounded-card shadow-dropdown p-6 text-charcoal relative space-y-4">
            <button
              onClick={() => setAdjustModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-xl font-bold">Manual Stock Adjustment</h2>
            <p className="text-xs text-muted">
              Adjust physical quantity. Storefront availability updates in real time.
            </p>

            <form onSubmit={handleExecuteAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Select Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                >
                  {inventory.map((inv) => (
                    <option key={inv.productId} value={inv.productId}>
                      {inv.productName} (Current Stock: {inv.totalAvailable})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Warehouse Location</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                >
                  <option value="wh-main">Central Distribution Hub (Chicago, IL)</option>
                  <option value="wh-west">Pacific Coast Facility (Reno, NV)</option>
                  <option value="wh-east">Atlantic Gateway (Bethlehem, PA)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Action Type</label>
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value as any)}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  >
                    <option value="add">Add Inbound Stock (+)</option>
                    <option value="remove">Write-off / Damage (-)</option>
                    <option value="reconcile">Cycle Count Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Units (Delta)</label>
                  <input
                    type="number"
                    min="1"
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Reason for Adjustment</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                >
                  <option value="Supplier Shipment Receipt">Supplier Shipment Receipt</option>
                  <option value="Cycle Count Discrepancy Correction">Cycle Count Discrepancy Correction</option>
                  <option value="Damaged / Inspection Defect">Damaged / Inspection Defect</option>
                  <option value="VIP Private Allocation">VIP Private Allocation</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Internal Audit Notes</label>
                <textarea
                  rows={2}
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  placeholder="Optional reference details..."
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                />
              </div>

              <div className="pt-4 border-t border-delicate flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 border border-delicate rounded-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest text-white rounded-button text-xs font-semibold shadow-subtle"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
