import React, { useState, useMemo } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { Product, CategorySlug } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FileSpreadsheet, 
  ExternalLink,
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, addToast } = useCommerceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Atelier Sound');
  const [formCategory, setFormCategory] = useState<CategorySlug>('electronics');
  const [formPrice, setFormPrice] = useState(195);
  const [formOriginalPrice, setFormOriginalPrice] = useState(230);
  const [formCostPrice, setFormCostPrice] = useState(80);
  const [formSku, setFormSku] = useState('AT-NEW-099');
  const [formStock, setFormStock] = useState(25);
  const [formDescription, setFormDescription] = useState('');
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'archived'>('active');

  // Filtered catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, categoryFilter, statusFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('Atelier Sound');
    setFormCategory('electronics');
    setFormPrice(195);
    setFormOriginalPrice(230);
    setFormCostPrice(80);
    setFormSku(`AT-${Math.floor(100 + Math.random() * 900)}`);
    setFormStock(30);
    setFormDescription('Artisanal craftmanship engineered with premium tactile materials.');
    setFormImages(['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80']);
    setFormStatus('active');
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice || prod.price);
    setFormCostPrice(prod.costPrice || Math.round(prod.price * 0.4));
    setFormSku(prod.sku);
    setFormStock(prod.stock);
    setFormDescription(prod.description);
    setFormImages(prod.images);
    setFormStatus(prod.status);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) return;

    const catObj = CATEGORIES.find((c) => c.slug === formCategory);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        brand: formBrand,
        category: formCategory,
        categoryName: catObj?.name || 'Curated Goods',
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        costPrice: Number(formCostPrice),
        sku: formSku,
        stock: Number(formStock),
        description: formDescription,
        images: formImages,
        status: formStatus,
      });
    } else {
      addProduct({
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: formName,
        brand: formBrand,
        category: formCategory,
        categoryName: catObj?.name || 'Curated Goods',
        description: formDescription,
        shortDescription: formDescription.slice(0, 80) + '...',
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        costPrice: Number(formCostPrice),
        sku: formSku,
        rating: 5.0,
        reviewCount: 1,
        stock: Number(formStock),
        lowStockThreshold: 8,
        images: formImages,
        variants: [
          {
            id: `var-${Date.now()}`,
            name: 'Standard Atelier Edition',
            sku: `${formSku}-STD`,
            stock: Number(formStock),
            attributes: { color: 'Standard' },
          },
        ],
        specifications: {
          'Origin': 'Designed & Assembled at Atelier Central',
          'Warranty': '2-Year Craftsmanship Guarantee',
        },
        tags: ['New Arrival', formBrand, catObj?.name || ''],
        status: formStatus,
      });
    }

    setProductModalOpen(false);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'SKU', 'Brand', 'Category', 'Price', 'Original Price', 'Stock', 'Status'];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.brand}"`,
      p.category,
      p.price,
      p.originalPrice || '',
      p.stock,
      p.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `atelier_catalog_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Catalog Exported',
      description: `${filteredProducts.length} product records exported to CSV.`,
    });
  };

  const handleSimulateCsvImport = () => {
    setCsvModalOpen(false);
    addToast({
      type: 'success',
      title: 'Bulk Import Simulated',
      description: 'Validated 12 mock product rows. Successfully merged into catalog.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Products & Variants
          </h1>
          <p className="text-xs text-muted">
            Directly manage prices, imagery, SKUs, and live customer storefront availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-delicate hover:bg-stone text-charcoal rounded-button text-xs font-medium transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-muted" />
            <span>CSV Import</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-delicate hover:bg-stone text-charcoal rounded-button text-xs font-medium transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-muted" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold transition-colors shadow-subtle"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, or brand..."
              className="w-full pl-9 pr-3 py-2 bg-stone/40 border border-delicate rounded-button text-xs outline-none focus:border-forest"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-stone/40 border border-delicate rounded-button text-xs text-charcoal outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-stone/40 border border-delicate rounded-button text-xs text-charcoal outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="text-xs text-muted font-mono shrink-0">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone/40 border-b border-delicate text-muted font-mono uppercase text-[10px]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedProductIds(filteredProducts.map((p) => p.id));
                      else setSelectedProductIds([]);
                    }}
                  />
                </th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="border-b border-delicate/40 hover:bg-stone/20 transition-colors">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(prod.id)}
                      onChange={() => {
                        setSelectedProductIds((prev) => 
                          prev.includes(prod.id) ? prev.filter((id) => id !== prod.id) : [...prev, prod.id]
                        );
                      }}
                    />
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt=""
                        className="w-10 h-10 object-cover rounded bg-stone shrink-0 border border-delicate"
                      />
                      <div className="min-w-0 max-w-[200px]">
                        <p className="font-bold text-charcoal truncate">{prod.name}</p>
                        <p className="text-[10px] text-muted font-mono truncate">{prod.brand}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-muted">
                    {prod.sku}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-stone rounded text-[11px] font-medium text-charcoal">
                      {prod.categoryName}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-charcoal">
                    ${prod.price.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className={`font-bold ${
                      prod.stock <= 0 ? 'text-error' : prod.stock <= 10 ? 'text-warning' : 'text-charcoal'
                    }`}>
                      {prod.stock} units
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      prod.status === 'active'
                        ? 'bg-forest/15 text-forest'
                        : prod.status === 'draft'
                        ? 'bg-stone text-muted'
                        : 'bg-error/15 text-error'
                    }`}>
                      {prod.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/product/${prod.slug}`}
                        target="_blank"
                        className="p-1 text-muted hover:text-forest"
                        title="View Live Storefront Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1 text-muted hover:text-charcoal"
                        title="Edit Catalog Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${prod.name}?`)) deleteProduct(prod.id);
                        }}
                        className="p-1 text-muted hover:text-error"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-2xl w-full bg-white border border-delicate rounded-card shadow-dropdown max-h-[90vh] overflow-y-auto p-6 text-charcoal relative">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-5 right-5 text-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-xl font-bold mb-1">
              {editingProduct ? 'Edit Product Catalog Entry' : 'Create New Product'}
            </h2>
            <p className="text-xs text-muted mb-6">
              Saved changes synchronize immediately to the live customer storefront.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1">Product Title</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sculptural White Oak Bench"
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Brand / Maker</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Original Price ($) (Optional for Sale)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Catalog SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Inventory Quantity</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs font-mono"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1">Editorial Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    value={formImages[0] || ''}
                    onChange={(e) => setFormImages([e.target.value])}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  />
                  {formImages[0] && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={formImages[0]} alt="Preview" className="w-12 h-12 object-cover rounded bg-stone border border-delicate" />
                      <span className="text-[11px] text-muted font-mono">Image preview</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  >
                    <option value="active">Active (Storefront Visible)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-delicate flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-delicate rounded-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest text-white rounded-button text-xs font-semibold shadow-subtle"
                >
                  {editingProduct ? 'Update Product' : 'Publish to Storefront'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CSV BULK IMPORT WORKFLOW MODAL ================= */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-lg w-full bg-white border border-delicate rounded-card shadow-dropdown p-6 text-charcoal relative space-y-4">
            <button
              onClick={() => setCsvModalOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-serif text-xl font-bold">CSV Bulk Catalog Ingestion</h2>
            <p className="text-xs text-muted">
              Simulate uploading large batches of merchandise with automatic schema mapping and row validation.
            </p>

            <div className="p-6 border-2 border-dashed border-delicate rounded-card text-center space-y-2 bg-stone/20">
              <FileSpreadsheet className="w-8 h-8 text-forest mx-auto" />
              <p className="text-xs font-medium text-charcoal">
                Drop your CSV file here, or browse files
              </p>
              <p className="text-[11px] text-muted">
                Supported formats: .CSV, .TSV (max 10MB)
              </p>
            </div>

            <div className="p-3 bg-stone/40 rounded text-xs space-y-1">
              <span className="font-bold text-charcoal block">Sample Column Headers:</span>
              <p className="font-mono text-[11px] text-muted">name, sku, brand, category, price, stock, image_url</p>
            </div>

            <div className="pt-4 border-t border-delicate flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCsvModalOpen(false)}
                className="px-4 py-2 border border-delicate rounded-button text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulateCsvImport}
                className="px-5 py-2 bg-forest text-white rounded-button text-xs font-semibold"
              >
                Simulate 12 Rows Import
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
