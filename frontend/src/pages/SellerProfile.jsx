import {
  UserIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

const SellerProfile = () => {
  const [adminName] = useState("أحمد المدير");
  const [adminEmail] = useState("seller@example.com");
  const [reviewCount] = useState(3);
  const [rating] = useState(4.6);
  const [showConfirm, setShowConfirm] = useState(false);

  const reviews = [
    {
      id: 1,
      reviewer: "خالد عبد الله",
      content: "الردود سريعة والمعاملة ممتازة.",
      date: "2025-05-20",
    },
    {
      id: 2,
      reviewer: "نورا علي",
      content: "مدير متعاون جدًا وخدمة رائعة.",
      date: "2025-05-18",
    },
    {
      id: 3,
      reviewer: "سامي الحربي",
      content: "تجربة إيجابية بشكل عام.",
      date: "2025-05-15",
    },
    {
      id: 3,
      reviewer: "سامي الحربي",
      content: "تجربة إيجابية بشكل عام.",
      date: "2025-05-15",
    },
      {
      id: 3,
      reviewer: "سامي الحربي",
      content: "تجربة إيجابية بشكل عام.",
      date: "2025-05-15",
    },
      {
      id: 3,
      reviewer: "سامي الحربي",
      content: "تجربة إيجابية بشكل عام.",
      date: "2025-05-15",
    },
      {
      id: 3,
      reviewer: "سامي الحربي",
      content: "تجربة إيجابية بشكل عام.",
      date: "2025-05-15",
    },
      {
      id: 3,
      reviewer: "سامي الحربي",
      content: "تجربة إيجابية بشكل عام.",
      date: "2025-05-15",
    },
  ];

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />);
    }

    if (halfStar) {
      stars.push(
        <StarIcon key="half" className="w-5 h-5 text-yellow-400 fill-yellow-200" />
      );
    }

    while (stars.length < 5) {
      stars.push(<StarIcon key={stars.length} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-25 px-4 flex justify-center" dir="rtl">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Seller Info */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 border">
          <div className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-[#4a60e9]" />
            <h2 className="text-xl font-semibold text-[#4a60e9]">بيانات البائع</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* <div className="w-14 h-14 bg-[#4a60e9] text-white flex items-center justify-center rounded-full text-xl font-bold">
              {adminName
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </div> */}
            <div className="flex-1 grid sm:grid-cols-2 gap-4 text-right">
              <div>
                <p className="text-sm text-gray-500">الاسم بالكامل</p>
                <p className="text-lg font-medium text-gray-800">{adminName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="text-lg font-medium text-gray-800">{adminEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">عدد المراجعات</p>
                <p className="text-lg font-medium text-gray-800">
                  {reviewCount} مراجعة
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">التقييم العام</p>
                <div className="flex items-center gap-1 mt-1">
                  {renderStars()}
                  <span className="text-sm text-gray-700">({rating} من 5)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-fit mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition flex items-center gap-1"
          >
            <TrashIcon className="w-5 h-5" />
            حذف الحساب
          </button>
        </div>

        {/* Reviews Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 border">
          <div className="flex items-center gap-2 mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#4a60e9]" />
            <h2 className="text-xl font-semibold text-[#4a60e9]">المراجعات</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#4a60e9] text-white flex items-center justify-center rounded-full text-sm font-bold">
                    {review.reviewer
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{review.reviewer}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Delete Modal */}
        <Dialog open={showConfirm} onClose={() => setShowConfirm(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
              <Dialog.Title className="text-lg font-semibold mb-4">
                هل أنت متأكد من حذف الحساب؟
              </Dialog.Title>
              <p className="text-sm text-gray-600 mb-6">
                لا يمكن التراجع عن هذه العملية بعد تنفيذها.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    alert("تم حذف الحساب.");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  نعم، احذف
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SellerProfile;
