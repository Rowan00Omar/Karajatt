import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import FeedbackSection from "./Feedback";
import Navbar from "./Navbar";
import SellerChat from "./SellerChat";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    name: "",
    comment: "",
    rating: 5,
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const mockResults = [
      {
        id: 1,
        name: "كمبروسر مكيف سوناتا ٢٠١٨",
        price: "٢٥٠ ريال",
        image:
          "https://media.istockphoto.com/id/1388637739/photo/mercedez-benz-glc-300-coupe-4matic-2022-matte-grey-closeup-car.jpg?s=612x612&w=0&k=20&c=8Bn62wf33y3wUg2ivDBR1YYkKv9VFPo4ZZqqzvqOuio=",
        extraImages: [
          "https://cloudfront-us-east-1.images.arcpublishing.com/tgam/FSW2QKURPVHLBBJLGW2GBX2VSI",
          "https://images.automatrix.com/1/99094/86R8oepdERG.JPG",
          "https://media.admiddleeast.com/photos/6724cf6793e8a2a64575a73e/16:9/w_2560%2Cc_limit/DK-02991.jpg",
        ],
        condition: "جيدة جداً",
        storageDuration: "٦ شهور",
        compatibleModels: "من ٢٠١٦ إلى ٢٠٢٠",
        seller: "مؤسسة الحسن لقطع الغيار",
        rating: 4.8,
        reviews: 32,
        additionaldetails: "بلا بلا بلا بلا فقط للتيست",
      },
    ];

    const found = mockResults.find((item) => item.id.toString() === id);
    setProduct(found);

    setFeedbacks([
      { name: "أحمد", rating: 5, comment: "قطعة ممتازة جداً ووصلت بحالة جيدة" },
      { name: "سارة", rating: 4, comment: "مقبولة ولكن تحتاج تنظيف بسيط" },
    ]);
  }, [id]);

  const allImages = product ? [product.image, ...product.extraImages] : [];

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
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") nextImage();
      if (e.key === "ArrowRight") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product]);

  const handlePurchase = () => {
    alert(`تم إرسال طلب شراء للقطعة: ${product.name}`);
  };

  if (!product) return <p className="text-center mt-20">جاري التحميل...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-25" dir="rtl">
        <div className="bg-white shadow-xl rounded-2xl border border-blue-200 overflow-hidden flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          <div className="lg:w-1/2 p-4 relative">
            <div {...handlers} className="relative">
              <Zoom>
                <img
                  src={allImages[currentImageIndex]}
                  alt={`صورة ${currentImageIndex + 1}`}
                  className="w-full h-80 object-cover rounded-xl border border-blue-100 cursor-zoom-in"
                />
              </Zoom>

              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow p-1 hover:bg-gray-200"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow p-1 hover:bg-gray-200"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`صورة ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-24 h-24 object-cover rounded-lg border ${
                    index === currentImageIndex
                      ? "border-blue-500"
                      : "border-blue-100"
                  } cursor-pointer hover:scale-105 transition`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 space-y-4">
            <h1 className="text-2xl font-bold text-blue-900">{product.name}</h1>
            <p className="text-xl font-semibold text-green-600">
              {product.price}
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
                  {product.storageDuration}
                </span>
              </div>
              <div>
                الموديلات الموافقة:{" "}
                <span className="font-medium text-gray-800">
                  {product.compatibleModels}
                </span>
              </div>
              <div>
                تقييم البائع:{" "}
                <span className="font-medium text-yellow-500">
                  {product.rating} ★
                </span>
              </div>
              <div>
                البائع:{" "}
                <span className="font-medium text-gray-800">
                  {product.seller}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-blue-800 font-semibold mb-2">
                تفاصيل إضافية:
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.additionaldetails}
              </p>
            </div>

            <button
              className="mt-6 w-full bg-babyJanaBlue text-white py-1 rounded-lg hover:bg-blue-900 transition"
              onClick={handlePurchase}
            >
              طلب القطعة
            </button>

            <button
              className="w-full bg-babyJanaBlue text-white py-1 rounded-lg hover:bg-blue-900 transition"
              onClick={() => setIsChatOpen(true)}
            >
              ارسال طلب عرض للبائع
            </button>
          </div>
        </div>

        <FeedbackSection />

        {isChatOpen && (
          <SellerChat product={product} onClose={() => setIsChatOpen(false)} />
        )}
      </div>
    </>
  );
};

export default ProductDetail;
