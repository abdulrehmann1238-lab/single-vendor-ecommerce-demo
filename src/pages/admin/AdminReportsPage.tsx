import React from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { FileText, Download, CheckCircle2, Calendar } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { addToast } = useCommerceStore();

  const reports = [
    {
      title: 'Monthly Executive Sales Ledger',
      period: 'February 2026',
      description: 'Comprehensive line-item accounting of all settled transactions, taxes, and courier fees.',
      size: '2.4 MB CSV',
    },
    {
      title: 'Warehouse Stock Valuation & Aging',
      period: 'As of March 01, 2026',
      description: 'Asset valuation report broken down by SKU, unit cost price, and warehouse location.',
      size: '1.8 MB CSV',
    },
    {
      title: 'Customer Lifetime Cohorts',
      period: 'Q4 2025 – Q1 2026',
      description: 'Repeat purchase cohorts, churn metrics, and average customer lifetime value by segment.',
      size: '890 KB CSV',
    },
    {
      title: 'Carrier Logistics & Surcharge Audit',
      period: 'Last 90 Days',
      description: 'DHL & FedEx actual transit performance, fuel surcharges, and on-time delivery rates.',
      size: '1.2 MB CSV',
    },
  ];

  const handleDownload = (name: string) => {
    addToast({
      type: 'success',
      title: 'Report Downloaded',
      description: `${name} has been generated and saved to your device.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
          Financial & Compliance Ledger
        </span>
        <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
          Operational Reports
        </h1>
        <p className="text-xs text-muted">
          Download verifiable CSV exports for accounting, tax compliance, and fulfillment reconciliation.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="p-5 bg-white border border-delicate rounded-card shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-stone rounded-button text-forest shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-charcoal">{rep.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{rep.description}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-muted pt-1">
                  <span>Period: {rep.period}</span>
                  <span>•</span>
                  <span>Size: {rep.size}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDownload(rep.title)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-stone hover:bg-delicate text-charcoal rounded-button text-xs font-semibold transition-colors shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
