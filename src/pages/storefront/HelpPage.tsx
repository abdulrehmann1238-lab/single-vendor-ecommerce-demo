import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  HelpCircle, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  CreditCard, 
  ChevronDown, 
  Search,
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Atelier complimentary delivery work?',
      a: 'We provide complimentary carbon-neutral courier delivery worldwide on all orders with a subtotal of $150 or more. Orders under $150 ship at a standard flat rate of $15. Expedited next-day options are available at checkout.',
    },
    {
      q: 'What is your 30-day trial and return policy?',
      a: 'Every piece is eligible for return within 30 days of confirmed delivery. Items must be in original condition with accompanying packaging and documentation. Return shipping is complimentary within North America and Europe via prepaid DHL/FedEx label.',
    },
    {
      q: 'Are your products covered by a warranty?',
      a: 'All Atelier products include our comprehensive 2-Year Craftsmanship Guarantee covering any manufacturing deviations or mechanical failures under everyday use.',
    },
    {
      q: 'Where are Atelier goods manufactured and fulfilled?',
      a: 'Our products are designed in our European and American studios, forged by specialized heritage workshops (such as Tuscan tanneries, Civitanova cordwainers, and Japanese iron forges), and fulfilled from our centralized distribution hub in Chicago, Illinois.',
    },
    {
      q: 'Is this an actual operational e-commerce store?',
      a: 'This application is a sophisticated, custom-coded single-vendor e-commerce demonstration designed for executive evaluation. It simulates catalog management, order fulfillment, multi-warehouse stock adjustments, and promotional logic using shared persistent frontend state.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-mono tracking-widest text-forest">
          Customer Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
          How can we assist you?
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
          Find answers regarding shipping timelines, returns, craftsmanship warranties, or get in touch with our specialists.
        </p>
      </div>

      {/* 4 Topic Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white border border-delicate rounded-card text-center space-y-2">
          <Truck className="w-5 h-5 text-forest mx-auto" />
          <h4 className="font-bold text-charcoal">Delivery</h4>
          <p className="text-[11px] text-muted">2-4 day global dispatch</p>
        </div>

        <div className="p-4 bg-white border border-delicate rounded-card text-center space-y-2">
          <RotateCcw className="w-5 h-5 text-forest mx-auto" />
          <h4 className="font-bold text-charcoal">Returns</h4>
          <p className="text-[11px] text-muted">30-day evaluation</p>
        </div>

        <div className="p-4 bg-white border border-delicate rounded-card text-center space-y-2">
          <ShieldCheck className="w-5 h-5 text-forest mx-auto" />
          <h4 className="font-bold text-charcoal">Warranty</h4>
          <p className="text-[11px] text-muted">2-year craft pledge</p>
        </div>

        <div className="p-4 bg-white border border-delicate rounded-card text-center space-y-2">
          <CreditCard className="w-5 h-5 text-forest mx-auto" />
          <h4 className="font-bold text-charcoal">Payment</h4>
          <p className="text-[11px] text-muted">Simulated checkout</p>
        </div>
      </div>

      {/* Accordion FAQs */}
      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-charcoal pb-2 border-b border-delicate">
          Frequently Answered Questions
        </h2>

        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-delicate rounded-card overflow-hidden bg-white">
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-charcoal hover:bg-stone/20 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-muted transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === idx && (
              <div className="px-4 pb-4 text-xs text-muted leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Need more help banner */}
      <div className="p-6 bg-stone/50 border border-delicate rounded-card flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <h3 className="font-bold text-charcoal text-sm">Need personalized assistance?</h3>
          <p className="text-muted mt-0.5">Our dedicated retail concierge is available Monday to Friday.</p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 bg-forest text-white rounded-button font-semibold shadow-subtle shrink-0"
        >
          Contact Our Team
        </Link>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { addToast } = useCommerceStore();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Specification Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Message Dispatched',
      description: 'Your inquiry has been routed to our retail specialists.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-mono tracking-widest text-forest">
          Direct Inquiries
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
          Contact Concierge
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
          We welcome inquiries regarding custom commissions, acoustic specifications, or order consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact info */}
        <div className="md:col-span-5 space-y-6 text-xs text-charcoal bg-stone/40 p-6 rounded-card border border-delicate">
          <div>
            <span className="font-mono uppercase text-muted text-[10px] block mb-1">Central Atelier</span>
            <p className="font-bold">Atelier & Co. Distribution Hub</p>
            <p className="text-muted">480 North Michigan Avenue, Suite 1200</p>
            <p className="text-muted">Chicago, IL 60611, United States</p>
          </div>

          <div className="space-y-2 pt-4 border-t border-delicate font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-forest" />
              <span>concierge@atelier-commerce.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-forest" />
              <span>+1 (800) 492-0192</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-card border border-delicate shadow-subtle">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold">Message Dispatched</h3>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Thank you for reaching out, {name}. A member of our concierge team will respond to {email} within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                >
                  <option value="Product Specification Inquiry">Product Specification Inquiry</option>
                  <option value="Delivery or Tracking Assistance">Delivery or Tracking Assistance</option>
                  <option value="Custom Bespoke Order">Custom Bespoke Order</option>
                  <option value="Corporate / Architectural Commission">Corporate / Architectural Commission</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Your Message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our product specialists assist you today?"
                  className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-forest hover:bg-forest-dark text-white font-semibold rounded-button shadow-subtle transition-colors text-xs"
              >
                Send Message to Concierge
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
