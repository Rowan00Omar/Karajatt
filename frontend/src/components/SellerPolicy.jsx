import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

function SellerPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-10 mb-10 text-right mt-24" dir="rtl">
          <h1 className="text-2xl font-bold text-[#4a60e9] mb-6">سياسة البائعين</h1>
          <p className="mb-4 text-gray-700">حتى نضمن تجربة عالية الجودة للمشتري، نلزم جميع البائعين باتباع هذه السياسات:</p>
          <h2 className="text-xl font-semibold text-[#4a60e9] mb-2">الشروط العامة:</h2>
          <ul className="list-disc pr-6 mb-4 text-gray-700 space-y-1">
            <li>يجب أن تكون جميع القطع المعروضة أصلية ومستعملة بحالة صالحة للاستخدام.</li>
            <li>الصور المعروضة للقطعة يجب أن تكون حقيقية وموضحة لحالتها بدقة.</li>
            <li>يمنع عرض أي قطعة بها عيوب كبيرة، أو تالفه، أو غير قابلة للتركيب.</li>
            <li>يجب تحديث حالة المخزون بانتظام لتفادي إلغاء الطلبات بسبب “النفاد”.</li>
            <li>في حال ثبت عرض قطع غير صالحة أو عدم الالتزام بالسياسات، يتم تعليق أو إيقاف الحساب مؤقتاً أو دائماً.</li>
          </ul>
          <h2 className="text-xl font-semibold text-[#4a60e9] mb-2">العمولة:</h2>
          <ul className="list-disc pr-6 mb-4 text-gray-700 space-y-1">
            <li>الموقع يقتطع عمولة ثابتة 10% من قيمة البيع (لا تشمل التوصيل أو الفحص).</li>
            <li>يتم تحويل المبلغ للبائع بعد استلام العميل والتأكد من عدم وجود استرجاع.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SellerPolicy