import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegStar, FaEye, FaEyeSlash, FaReply } from 'react-icons/fa';
import reviewService from '../../services/reviewService';
import { useToastContext } from '../../context/ToastContext';
import { getResponseList } from '../../utils/apiResponse';

const ManageReviews = () => {
  const toast = useToastContext();
  const [reviews, setReviews] = useState([]);
  const [hiddenReviewIds, setHiddenReviewIds] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await reviewService.getReviews();
        setReviews(getResponseList(response));
      } catch (error) {
        toast.error(error.message || 'Unable to load reviews from the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [toast]);

  const toggleStatus = (id) => {
    setHiddenReviewIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const submitReply = (e) => {
    e.preventDefault();
    setReplyingTo(null);
    setReplyText('');
    toast.success('Reply saved locally.');
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
        Loading reviews from the database...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Customer Reviews</h1>
          <p className="text-gray-400 text-sm">Monitor customer feedback, ratings, and written comments.</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, i) => {
          const isHidden = hiddenReviewIds.has(review._id);
          const displayName = review.customer?.name || 'Anonymous';
          const productName = review.product?.name || 'Product';
          const reviewDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date';

          return (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-[#0a0a0a] border ${isHidden ? 'border-red-500/20 opacity-70' : 'border-white/5'} rounded-2xl p-6 transition-all`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-medium text-white">{displayName}</h3>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{reviewDate}</span>
                    {isHidden && (
                      <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded font-medium">Hidden</span>
                    )}
                  </div>
                  <p className="text-sm text-gold-500 font-serif">Re: {productName}</p>
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
                  onClick={() => toggleStatus(review._id)}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded transition ${
                    isHidden
                      ? 'text-green-500 hover:bg-green-500/10'
                      : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                  }`}
                >
                  {isHidden ? <><FaEye /> Publish</> : <><FaEyeSlash /> Hide Review</>}
                </button>
                <button
                  onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:bg-blue-400/10 px-3 py-1.5 rounded transition"
                >
                  <FaReply /> Reply
                </button>
              </div>

              <AnimatePresence>
                {replyingTo === review._id && (
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
                        placeholder={`Reply publicly to ${displayName}...`}
                        className="flex-1 bg-dark-200 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                      />
                      <button type="submit" className="btn-primary py-2 px-6 text-sm">Send</button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageReviews;
