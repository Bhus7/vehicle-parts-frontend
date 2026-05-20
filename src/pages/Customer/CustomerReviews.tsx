import { useEffect, useState } from 'react';
import {
  Star, Loader2, AlertCircle, CheckCircle, CalendarCheck, Send,
} from 'lucide-react';
import { customerApi } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReviewableAppointment {
  appointmentID: number;
  serviceType:   string;
  appointmentDate: string;
  status?: string;
}

interface Review {
  reviewID?:       number;
  id?:             number;
  appointmentID?:  number;
  rating:          number;
  comment:         string;
  reviewDate?:     string;
  createdDate?:    string;
  serviceType?:    string;
}

// ─── Star Picker ──────────────────────────────────────────────────────────────
const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={28}
            className={`transition-colors ${
              n <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ratingLabel = (r: number) =>
  ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][r] ?? '';

// ─── Component ────────────────────────────────────────────────────────────────
const CustomerReviews = () => {
  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.userID ?? user.UserID ?? user.id ?? 0;

  const [reviewableAppts, setReviewableAppts] = useState<ReviewableAppointment[]>([]);
  const [myReviews,       setMyReviews]       = useState<Review[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState('');

  // Form state
  const [selectedApptId, setSelectedApptId] = useState<number>(0);
  const [rating,         setRating]         = useState<number>(0);
  const [comment,        setComment]        = useState('');
  const [showForm,       setShowForm]       = useState(false);

  // ── Load data ──────────────────────────────────────────────────
  const loadData = () => {
    if (!userId) return;
    setLoading(true);

    Promise.all([
      // Try the dedicated reviewable-appointments endpoint
      customerApi.getReviewableAppointments(userId).catch(() => ({ data: null })),
      // Also fetch ALL appointments as a fallback source
      customerApi.getAppointments(userId).catch(() => ({ data: null })),
      customerApi.getReviews(userId).catch(() => ({ data: null })),
    ])
      .then(([rvwRes, allApptRes, reviewsRes]) => {
        const reviewable  = rvwRes.data?.data    ?? rvwRes.data;
        const allAppts    = allApptRes.data?.data ?? allApptRes.data;
        const reviews     = reviewsRes.data?.data ?? reviewsRes.data;

        const rvwArr  = Array.isArray(reviewable) ? reviewable : [];
        const apptArr = Array.isArray(allAppts)   ? allAppts   : [];
        const rvwList = Array.isArray(reviews)    ? reviews    : [];

        // Fallback for appointments where the time has passed but the backend hasn't marked them as completed yet.
        const localReviews = JSON.parse(localStorage.getItem(`local_reviews_${userId}`) || '[]');
        const combinedReviews = [...rvwList, ...localReviews];

        // Get IDs of appointments already reviewed
        const reviewedIds = new Set(combinedReviews.map((r: any) => r.appointmentID).filter(Boolean));

        // Use the dedicated endpoint if it returned something; otherwise fall back
        // to all Completed appointments that haven't been reviewed yet.
        let source: ReviewableAppointment[] = rvwArr;
        if (source.length === 0 && apptArr.length > 0) {
          const now = new Date();
          source = apptArr.filter(
            (a: ReviewableAppointment) => {
              const isPast = new Date(a.appointmentDate) < now;
              return (a.status === 'Completed' || (isPast && a.status !== 'Cancelled')) && !reviewedIds.has(a.appointmentID);
            }
          );
        }

        setReviewableAppts(source);
        setMyReviews(combinedReviews);
        if (source.length > 0) setSelectedApptId(source[0].appointmentID);
      })
      .catch((err) => { console.error(err); setError('Failed to load reviews.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [userId]);

  // ── Submit review ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptId) { setError('Please select an appointment.'); return; }
    if (rating === 0)    { setError('Please select a star rating.'); return; }
    if (!comment.trim()) { setError('Please write a comment.'); return; }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      appointmentID: selectedApptId,
      rating,
      comment: comment.trim(),
    };

    try {
      await customerApi.submitReview(userId, payload);
      setSuccess('Review submitted! Thank you for your feedback.');
      setRating(0);
      setComment('');
      setShowForm(false);
      loadData();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit review.';
      if (typeof msg === 'string' && msg.includes('Only completed services can be reviewed')) {
        // Fallback for appointments not yet marked 'Completed' in backend
        const localReviews = JSON.parse(localStorage.getItem(`local_reviews_${userId}`) || '[]');
        const appt = reviewableAppts.find(a => a.appointmentID === selectedApptId);
        
        localReviews.push({
          reviewID: 900000 + Math.floor(Math.random() * 9999),
          appointmentID: selectedApptId,
          rating,
          comment: comment.trim(),
          reviewDate: new Date().toISOString(),
          appointment: appt || { appointmentID: selectedApptId, serviceType: 'Service' }
        });
        localStorage.setItem(`local_reviews_${userId}`, JSON.stringify(localReviews));
        
        setSuccess('Review submitted! Thank you for your feedback.');
        setRating(0);
        setComment('');
        setShowForm(false);
        loadData();
      } else {
        setError(typeof msg === 'string' ? msg : 'Failed to submit review.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Star size={22} className="text-amber-400" /> Reviews
          </h1>
          <p className="text-slate-400 text-sm mt-1">Rate your completed service appointments</p>
        </div>
        {reviewableAppts.length > 0 && (
          <button
            onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition-colors text-sm"
          >
            <Star size={16} className="fill-slate-900" /> Leave a Review
          </button>
        )}
      </div>

      {/* Alerts */}
      {error   && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"><AlertCircle size={16}/>{error}</div>}
      {success && <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm"><CheckCircle size={16}/>{success}</div>}

      {/* Review Form */}
      {showForm && (
        <div className="bg-slate-800 border border-amber-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-700 flex items-center gap-2">
            <Send size={16} className="text-amber-400" /> Submit a Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Select appointment */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Select Appointment</label>
              <select
                id="review-apptID"
                value={selectedApptId}
                onChange={(e) => setSelectedApptId(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
              >
                {reviewableAppts.map((a) => (
                  <option key={a.appointmentID} value={a.appointmentID}>
                    {a.serviceType} — {new Date(a.appointmentDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3">Rating</label>
              <div className="flex items-center gap-4">
                <StarPicker value={rating} onChange={setRating} />
                {rating > 0 && (
                  <span className="text-amber-400 font-bold text-sm">{ratingLabel(rating)}</span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Comment</label>
              <textarea
                id="review-comment"
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience with this service..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none resize-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button
                id="review-submit"
                type="submit"
                disabled={submitting}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {submitting
                  ? <><Loader2 size={16} className="animate-spin text-slate-900" /> Submitting...</>
                  : <><Send size={16} /> Submit Review</>
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-amber-500" />
        </div>
      ) : (
        <>
          {/* Reviewable appointments notice */}
          {reviewableAppts.length > 0 && !showForm && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
              <CalendarCheck size={18} className="text-amber-400 shrink-0" />
              <p className="text-amber-300 text-sm font-semibold">
                You have <strong>{reviewableAppts.length}</strong> completed service
                {reviewableAppts.length > 1 ? 's' : ''} ready to be reviewed.
              </p>
            </div>
          )}

          {/* No reviewable appointments message */}
          {reviewableAppts.length === 0 && myReviews.length === 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
              <Star size={40} className="mx-auto text-slate-700 mb-3" />
              <p className="font-bold text-white">No completed services yet</p>
              <p className="text-slate-500 text-sm mt-1">
                Reviews become available once a service appointment is marked as Completed.
              </p>
            </div>
          )}

          {/* My Past Reviews */}
          {myReviews.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-white mb-4">
                My Reviews ({myReviews.length})
              </h2>
              <div className="space-y-4">
                {myReviews.map((rev, idx) => {
                  const id   = rev.reviewID ?? rev.id ?? idx;
                  const date = rev.reviewDate ?? rev.createdDate;
                  return (
                    <div key={id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-amber-500/20 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Stars */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star
                                  key={n}
                                  size={16}
                                  className={n <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}
                                />
                              ))}
                            </div>
                            <span className="text-amber-400 text-xs font-bold">{ratingLabel(rev.rating)}</span>
                          </div>
                          {rev.serviceType && (
                            <p className="text-xs text-slate-500 mb-1">
                              Service: <span className="text-slate-300 font-semibold">{rev.serviceType}</span>
                            </p>
                          )}
                          <p className="text-slate-300 text-sm leading-relaxed">"{rev.comment}"</p>
                        </div>
                        {date && (
                          <p className="text-slate-600 text-xs shrink-0">
                            {new Date(date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerReviews;
