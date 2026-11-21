import { InventoryRecord } from '../types';
import { INITIAL_PRODUCTS } from './initialProducts';

export const INITIAL_INVENTORY: InventoryRecord[] = INITIAL_PRODUCTS.map((prod) => {
  const qMain = Math.floor(prod.stock * 0.55);
  const qWest = Math.floor(prod.stock * 0.30);
  const qEast = Math.max(0, prod.stock - qMain - qWest);

  return {
    productId: prod.id,
    productName: prod.name,
    sku: prod.sku,
    category: prod.category,
    reorderThreshold: prod.lowStockThreshold || 8,
    warehouses: [
      {
        warehouseId: 'wh-main',
        warehouseName: 'Central Distribution Hub (Chicago, IL)',
        location: 'Aisle 04, Bay B',
        quantity: qMain,
        reserved: Math.min(3, Math.floor(qMain * 0.1)),
        incoming: 15,
      },
      {
        warehouseId: 'wh-west',
        warehouseName: 'Pacific Coast Facility (Reno, NV)',
        location: 'Zone W-12',
        quantity: qWest,
        reserved: Math.min(2, Math.floor(qWest * 0.1)),
        incoming: 10,
      },
      {
        warehouseId: 'wh-east',
        warehouseName: 'Atlantic Gateway (Bethlehem, PA)',
        location: 'Rack E-08',
        quantity: qEast,
        reserved: 1,
        incoming: 5,
      },
    ],
    totalAvailable: prod.stock,
    totalReserved: Math.min(6, Math.floor(prod.stock * 0.12)),
    totalIncoming: 30,
    status: prod.stock <= 0 ? 'out_of_stock' : (prod.stock <= (prod.lowStockThreshold || 10) ? 'low_stock' : 'in_stock'),
    lastStockAdjustment: '2026-03-01T08:00:00Z',
  };
});
