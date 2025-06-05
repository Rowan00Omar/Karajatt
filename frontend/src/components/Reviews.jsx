import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import axios from "axios";

const Reviews = ({ type, id }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    product_id: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchReviews();
    if (type === "seller") {
      fetchSellerProducts();
    }
    checkUserRole();
  }, [type, id]);

  const checkUserRole = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role);
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(`/api/seller/profile/${id}`);
      setSellerProducts(response.data.products || []);
    } catch (err) {
      console.error("Error fetching seller products:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const endpoint =
        type === "product"
          ? `/api/product/${id}/reviews`
          : `/api/seller/${id}/reviews`;

      const response = await axios.get(endpoint);
      setReviews(response.data.reviews);
      setAverageRating(response.data.average_rating);

      // Check if current user has already reviewed
      const token = localStorage.getItem("token");
      if (token) {
        const userResponse = await axios.get("/api/auth/userInfo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = userResponse.data.id;
        setCurrentUserId(userId);
        const hasReviewed = response.data.reviews.some(
          (review) => review.user_id === userId
        );
        setUserHasReviewed(hasReviewed);
      }
    } catch (err) {
      setError("Failed to load reviews");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("يرجى تسجيل الدخول لإضافة تقييم");
        return;
      }

      if (userRole !== "user") {
        setError("فقط المستخدمين يمكنهم إضافة تقييمات");
        return;
      }

      if (type === "seller" && !newReview.product_id) {
        setError("يرجى اختيار المنتج للتقييم");
        return;
      }

      const endpoint =
        type === "product"
          ? `/api/product/${id}/reviews`
          : `/api/seller/${id}/reviews`;

      await axios.post(endpoint, newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh reviews after submission
      fetchReviews();
      setNewReview({ rating: 5, comment: "", product_id: null });
    } catch (err) {
      setError(err.response?.data?.message || "فشل في إرسال التقييم");
      console.error("Error submitting review:", err);
    }
  };

  if (loading) return <div className="text-center py-4">جاري التحميل...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-blue-900">
          التقييمات والمراجعات ({reviews.length})
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({averageRating} من 5)</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 mb-6">
        {reviews.map((review) => (
          <div
            key={review.review_id}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  {review.reviewer_name?.charAt(0)}
                </div>
                <div>
                  <span className="font-medium block">
                    {review.reviewer_name}
                  </span>
                  {review.product_title && (
                    <span className="text-sm text-gray-500">
                      منتج: {review.product_title}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(review.created_at).toLocaleDateString("ar-SA")}
            </p>
          </div>
        ))}
      </div>

      {/* Add Review Form - Only show for users */}
      {!userHasReviewed && userRole === "user" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "seller" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اختر المنتج
              </label>
              <select
                value={newReview.product_id || ""}
                onChange={(e) =>
                  setNewReview({ ...newReview, product_id: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">اختر المنتج</option>
                {sellerProducts.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.title || product.part_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              التقييم
            </label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="w-full p-2 border rounded-md"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "نجمة" : "نجوم"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تعليقك
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              required
              rows="3"
              className="w-full p-2 border rounded-md"
              placeholder="اكتب تعليقك هنا..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            إرسال التقييم
          </button>
        </form>
      )}
    </div>
  );
};

export default Reviews;
