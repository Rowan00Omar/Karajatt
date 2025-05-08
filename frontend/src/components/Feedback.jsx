import { useState, useEffect } from 'react';

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([
    { name: 'أحمد', rating: 5, comment: 'قطعة ممتازة جداً ووصلت بحالة جيدة' },
    { name: 'سارة', rating: 4, comment: 'مقبولة ولكن تحتاج تنظيف بسيط' },
  ]);

  const [newFeedback, setNewFeedback] = useState({ name: '', comment: '', rating: 5 });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (feedbacks.length > 0) {
      const avg = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;
      setAverageRating(avg.toFixed(1));
    } else {
      setAverageRating(0);
    }
  }, [feedbacks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newFeedback.name || !newFeedback.comment) return;

    // Check for existing feedback by name
    if (feedbacks.find(f => f.name.trim() === newFeedback.name.trim())) {
      setHasSubmitted(true);
      return;
    }

    setFeedbacks([...feedbacks, newFeedback]);
    setNewFeedback({ name: '', comment: '', rating: 5 });
    setHasSubmitted(false);
  };

  return (
    <div className="bg-white mt-10 p-6 rounded-xl border border-blue-200 shadow-md" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-900">التقييمات والملاحظات</h2>
        <span className="text-yellow-600 font-semibold">متوسط التقييم: {averageRating} ★</span>
      </div>

      {/* Feedback List */}
      <div className="space-y-4 mb-6">
        {feedbacks.map((fb, idx) => (
          <div key={idx} className="border rounded-lg p-3 text-sm bg-gray-50">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-blue-800">{fb.name}</span>
              <span className="text-yellow-500">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
            </div>
            <p className="text-gray-700">{fb.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Feedback */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="اسمك"
          className="w-full p-2 border rounded"
          value={newFeedback.name}
          onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
        />
        <textarea
          rows="3"
          placeholder="اكتب ملاحظتك..."
          className="w-full p-2 border rounded"
          value={newFeedback.comment}
          onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-blue-900">التقييم:</label>
          <select
            className="border p-1 rounded"
            value={newFeedback.rating}
            onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {hasSubmitted && (
          <p className="text-red-500 text-sm">لقد قمت بإضافة تقييم مسبقاً.</p>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={hasSubmitted}
        >
          إضافة التقييم
        </button>
      </form>
    </div>
  );
};

export default FeedbackSection;
