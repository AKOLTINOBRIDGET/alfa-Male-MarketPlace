import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3–7 business days within the country. International orders may take up to 14 business days depending on location and customs processing.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! All orders over $500 qualify for complimentary express shipping. Orders below this threshold attract a flat $25 shipping fee.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 14 days of delivery for all items in their original, unworn condition with tags attached. Custom tailored items are non-refundable.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Email our support team at returns@alfamale.com with your order number and reason for return. We will provide a prepaid return label within 24 hours.',
      },
    ],
  },
  {
    category: 'Custom Tailoring',
    items: [
      {
        q: 'How does the custom tailoring service work?',
        a: 'Simply navigate to our Bespoke Tailoring page, select your preferred fabric, and either provide your measurements or book an in-store appointment with one of our master tailors. Your custom piece is typically ready within 3–4 weeks.',
      },
      {
        q: 'Can I make changes to a custom order after placing it?',
        a: 'Changes can be accommodated within 48 hours of order placement. After that, production begins and changes may incur additional fees. Please contact us immediately if you need adjustments.',
      },
      {
        q: 'What is the price range for custom suits?',
        a: 'Custom suit pricing starts from $300 (Irish Linen) and goes up to $600+ for premium silk blends and bespoke fabrics, depending on your design requirements and selected finish.',
      },
    ],
  },
  {
    category: 'Payment & Security',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major bank cards (Visa, Mastercard) and mobile money payments including MTN Mobile Money and Airtel Money. All transactions are encrypted and secure.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. Our checkout is powered by an industry-standard encrypted payment gateway. We never store your card or mobile money details on our servers.',
      },
    ],
  },
  {
    category: 'Sizing & Fit',
    items: [
      {
        q: 'How do I find the right size?',
        a: 'Each product page includes a Size Guide tailored to that product category (e.g., EU shoe sizes for footwear, and chest/waist measurements for suits). When in doubt, our tailoring team is happy to advise via email.',
      },
      {
        q: 'What if the item doesn\'t fit?',
        a: 'For ready-to-wear items, we offer free exchanges for a different size within 14 days. For suits, we also offer a one-time complimentary alteration service at any of our partner locations.',
      },
    ],
  },
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className={`font-medium transition-colors ${isOpen ? 'text-gold-500' : 'text-white'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gold-500 flex-shrink-0"
        >
          <FaChevronDown />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-dark py-16 text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Frequently Asked Questions</h1>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-6" />
          <p className="text-gray-400 max-w-xl mx-auto">
            Everything you need to know about shopping with The Alfa Male. Can't find what you're looking for? 
            <a href="mailto:support@alfamale.com" className="text-gold-500 hover:underline ml-1">Contact our team.</a>
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, i) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-dark-100 rounded-2xl border border-white/5 px-6 md:px-10 py-4"
            >
              <h2 className="text-xl font-serif text-gold-500 pt-4 pb-2 mb-2 border-b border-white/10">
                {category.category}
              </h2>
              {category.items.map(({ q, a }) => (
                <AccordionItem key={q} question={q} answer={a} />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-dark-100 p-12 rounded-2xl border border-white/5">
          <h3 className="text-2xl font-serif text-white mb-3">Still have questions?</h3>
          <p className="text-gray-400 mb-6">Our team is on hand 7 days a week to assist you.</p>
          <a href="mailto:support@alfamale.com" className="btn-primary">
            Email Support
          </a>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
