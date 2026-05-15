import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegStar, FaEye, FaEyeSlash, FaReply } from 'react-icons/fa';

const initialReviews = [
  { 
    id: 'REV-01', 
    customer: 'James Carter', 
    product: 'Classic Suit 4',
    rating: 5, 
    date: '2026-05-14',
    comment: 'Absolutely stunning craftsmanship. The fit is perfect right out of the box. Highly recommend the bespoke service!',
    status: 'Published'
  },
  { 
    id: 'REV-02', 
    customer: 'Michael Doe', 
    product: 'Office Shoe 2',
    rating: 4, 
    date: '2026-05-10',
    comment: 'Great quality leather. They were a bit stiff on the first day but broke in nicely. Look very professional.',
    status: 'Published'
  },
  { 
    id: 'REV-03', 
    customer: 'Anonymous', 
    product: 'Luxury Watch 11',
    rating: 2, 
    date: '2026-05-05',
    comment: 'The watch looks good, but the clasp feels a bit loose. Expected better for the price.',
    status: 'Hidden'
  },
  { 
    id: 'REV-04', 
    customer: 'Bruce Wayne', 
    product: 'Bespoke Tailoring',
    rating: 5, 
    date: '2026-05-01',
    comment: 'The Pluch Velvet in Midnight Blue is spectacular. Antonio Rossi is a true master of his craft. I will be ordering another soon.',
    status: 'Published'
  },
];

const ManageReviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const toggleStatus = (id) => {
    setReviews(reviews.map(rev => {
      if (rev.id === id) {
        return { ...rev, status: rev.status === 'Published' ? 'Hidden' : 'Published' };
      }
      return rev;
    }));
  };

  const submitReply = (e) => {
    e.preventDefault();
    // In a real app, this would save the reply to the backend.
    setReplyingTo(null);
    setReplyText('');
    alert('Reply sent successfully!');
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Customer Reviews</h1>
          <p className="text-gray-400 text-sm">Monitor customer feedback, ratings, and written comments.</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-[#0a0a0a] border ${review.status === 'Hidden' ? 'border-red-500/20 opacity-70' : 'border-white/5'} rounded-2xl p-6 transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-medium text-white">{review.customer}</h3>
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{review.date}</span>
                  {review.status === 'Hidden' && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded font-medium">Hidden</span>
                  )}
                </div>
                <p className="text-sm text-gold-500 font-serif">Re: {review.product}</p>
              </div>
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, index) => (
                  index < review.rating ? <FaStar key={index} /> : <FaRegStar key={index} />
                ))}
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{review.comment}"</p>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <button 
                onClick={() => toggleStatus(review.id)}
                className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded transition ${
                  review.status === 'Published' 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' 
                    : 'text-green-500 hover:bg-green-500/10'
                }`}
              >
                {review.status === 'Published' ? <><FaEyeSlash /> Hide Review</> : <><FaEye /> Publish</>}
              </button>
              
              <button 
                onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:bg-blue-400/10 px-3 py-1.5 rounded transition"
              >
                <FaReply /> Reply
              </button>
            </div>

            {/* Inline Reply Form */}
            <AnimatePresence>
              {replyingTo === review.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4"
                >
                  <form onSubmit={submitReply} className="flex gap-3">
                    <input 
                      type="text" 
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply publicly to ${review.customer}...`}
                      className="flex-1 bg-dark-200 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                    <button type="submit" className="btn-primary py-2 px-6 text-sm">Send</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageReviews;
