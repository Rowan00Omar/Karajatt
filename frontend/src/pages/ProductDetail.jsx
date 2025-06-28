import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useCart } from "../context/CartContext";
import Reviews from "../components/Reviews";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    trackMouse: true,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `/api/products/getSingleProduct/${id}`
        );
        setProduct(response.data);
        // Create array of all available images
        const images = [
          response.data.image_url,
          response.data.extra_image1,
          response.data.extra_image2,
          response.data.extra_image3,
        ].filter(Boolean); // Remove null/undefined values
        setAllImages(images);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch product details"
        );
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!product)
    return <div className="text-center py-8">لم يتم العثور على المنتج</div>;

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Product Images */}
        <div className="relative max-w-md mx-auto w-full" {...handlers}>
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            <Zoom>
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src={allImages[currentImageIndex] || "/placeholder.jpg"}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain"
                  style={{ backgroundColor: "white" }}
                />
              </div>
            </Zoom>
          </div>
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          {allImages.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    idx === currentImageIndex
                      ? "bg-blue-600 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6" dir="rtl">
          <h1 className="text-2xl font-bold text-blue-900">
            {product.title || product.part_name}
          </h1>
          <p className="text-xl font-semibold text-green-600">
            {product.price} ريال
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm text-blue-900">
            <div>
              الحالة:{" "}
              <span className="font-medium text-gray-800">
                {product.condition}
              </span>
            </div>
            <div>
              مدة التخزين:{" "}
              <span className="font-medium text-gray-800">
                {product.storage_duration}
              </span>
            </div>
            <div>
              الموديل:
              <span className="font-medium text-gray-800">
                {product.car_name}
              </span>
            </div>
            <div>
              التصنيف:
              <span className="font-medium text-gray-800">
                {product.category_name}
              </span>
            </div>

            <div>
              البائع:{" "}
              <span
                className="font-medium text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate(`/seller/${product.seller_id}`)}
              >
                {product.seller_name}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-blue-800 font-semibold mb-2">تفاصيل إضافية:</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleAddToCart(product)}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة إلى السلة
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Reviews type="product" id={id} />
      </div>
    </div>
  );
};

export default ProductDetail;
