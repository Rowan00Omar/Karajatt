import { UserIcon, StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import React, { useState } from "react";

const SellerProfile = () => {
  const [adminName] = useState("أحمد المدير");
  const [adminEmail] = useState("seller@example.com");
  const [reviewCount] = useState(3);
  const [rating] = useState(4.6);

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
  ];

  return (
    <div className="min-h-screen bg-white py-25 px-4 flex justify-center" dir="rtl">
      <div className="w-full max-w-4xl flex flex-col gap-8 text-right">
        {/* Admin Info Card */}
        <div className="w-full bg-white border border-gray-200 shadow-lg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="w-6 h-6 text-[#4a60e9]" />
            <h2 className="text-xl font-semibold text-[#4a60e9]">بيانات البائع</h2>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">الأسم بالكامل</p>
            <p className="text-lg font-medium text-gray-900">{adminName}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">البريد الإلكتروني</p>
            <p className="text-lg font-medium text-gray-900">{adminEmail}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">عدد المراجعات</p>
            <p className="text-lg font-medium text-gray-900">{reviewCount} مراجعة</p>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <div>
              <p className="text-sm text-gray-500">التقييم العام</p>
              <p className="text-lg font-medium text-gray-900">{rating} من 5</p>
            </div>
            <StarIcon className="w-6 h-6 text-yellow-500" />
          </div>

          <button className="w-32 mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition">
            حذف الحساب
          </button>
        </div>

        {/* Reviews Section */}
        <div className="w-full bg-white border border-gray-200 shadow-lg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#4a60e9]" />
            <h2 className="text-xl font-semibold text-[#4a60e9]">المراجعات</h2>
          </div>
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-3">
                <p className="text-sm text-gray-500">{review.date}</p>
                <p className="text-base font-medium text-gray-800">{review.reviewer}</p>
                <p className="text-sm text-gray-700 mt-1">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
