// src/components/booking/RatingModal.jsx
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Modal, Button } from '../common';

export default function RatingModal({ booking, isOpen, onClose, onSubmit }) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    try {
      await onSubmit(booking._id, rating, review);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate Your Experience">
      <div className="space-y-5">
        <p className="text-slate-400 text-sm">
          How was your experience with <strong className="text-white">{booking?.mechanic?.name}</strong>?
        </p>

        {/* Star selector */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={36}
                className={`transition-colors ${
                  star <= (hovered || rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm text-amber-400 font-medium">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
          </p>
        )}

        {/* Review text */}
        <textarea
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave a review (optional)..."
          className="w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-xl resize-none border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
        />

        <div className="flex gap-3">
          <Button variant="ghost" size="md" className="flex-1" onClick={onClose}>
            Skip
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleSubmit}
            loading={loading}
            disabled={!rating}
          >
            Submit Rating
          </Button>
        </div>
      </div>
    </Modal>
  );
}
