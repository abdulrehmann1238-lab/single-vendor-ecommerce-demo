import React from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCommerceStore();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />;
            case 'error':
              return <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />;
            default:
              return <Info className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-white border border-delicate rounded-card shadow-elevated animate-fade-up text-charcoal transition-all"
            role="status"
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted hover:text-charcoal p-1 transition-colors rounded-sm"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
