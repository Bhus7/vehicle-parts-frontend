import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertCircle, CheckCircle, Calendar, Wrench } from 'lucide-react';
import { reviewApi } from '../../api/customerApi';

interface ReviewableAppointment {
  appointmentID: number;
  appointmentDate: string;
  serviceType: string;
  vehicleNumber: string;
}

interface Review {
  reviewID: number;
  appointmentID: number;
  rating: number;
  comment: string;
  reviewDate: string;
  serviceType?: string;
}

const Reviews = () => {
  const customerId = parseInt(localStorage.getItem('customerId') || '0');
  
  const [reviewable, setReviewable] = useState<ReviewableAppointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  
  // Status State
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [customerId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewableRes, reviewsRes] = await Promise.all([
        reviewApi.getReviewableAppointments(customerId),
        reviewApi.getReviews(customerId)
      ]);
      
      setReviewable(reviewableRes.data?.data || reviewableRes.data || []);
      setReviews(reviewsRes.data?.data || reviewsRes.data || []);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) {
      setMessage({ type: 'error', text: 'Please select an appointment to review.' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      await reviewApi.submitReview(customerId, {
        appointmentID: selectedAppointment,
        rating,
        comment
      });
      
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      
      // Reset form
      setSelectedAppointment(null);
      setRating(5);
      setComment('');
      
      // Refresh data
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.response?.data || 'Failed to submit review.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Service Reviews</h1>
        <p className="text-slate-400 mt-1">Rate your completed services and view past reviews</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Review Form Section */}
      {reviewable.length > 0 && (
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="text-yellow-500" size={24} /> Write a Review
          </h2>
          
          <form onSubmit={handleSubmitReview} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Select Completed Service</label>
              <select 
                value={selectedAppointment || ''}
                onChange={(e) => setSelectedAppointment(Number(e.target.value))}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
              >
                <option value="" disabled>Select a service to review...</option>
                {reviewable.map(app => (
                  <option key={app.appointmentID} value={app.appointmentID}>
                    {new Date(app.appointmentDate).toLocaleDateString()} - {app.serviceType} ({app.vehicleNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg transition-colors ${rating >= star ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-500 hover:bg-slate-700'}`}
                  >
                    <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Comment</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none resize-none"
                placeholder="How was your experience?"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={submitting || !selectedAppointment}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'} <MessageSquare size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Past Reviews Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Your Past Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-12 text-center">
            <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
            <p className="text-slate-400">You haven't reviewed any services yet. Complete a service to write a review.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.reviewID} className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={18} 
                          className={review.rating >= star ? "text-yellow-500" : "text-slate-600"} 
                          fill={review.rating >= star ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(review.reviewDate).toLocaleDateString()}</span>
                      {review.serviceType && <span className="flex items-center gap-1"><Wrench size={14} /> {review.serviceType}</span>}
                    </div>
                  </div>
                </div>
                <p className="text-white bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">"{review.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
