import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const DeliveryPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-10 mb-10 text-right mt-24" dir="rtl">
          <h1 className="text-2xl font-bold text-[#4a60e9] mb-6">سياسة التوصيل</h1>
          <p className="mb-4 text-gray-700">نحرص في منصتنا على تقديم خدمة توصيل سريعة ومريحة لعملائنا داخل مدينة الرياض.</p>
          <h2 className="text-xl font-semibold text-[#4a60e9] mb-2">شروط التوصيل:</h2>
          <ul className="list-disc pr-6 mb-4 text-gray-700 space-y-1">
            <li>التوصيل يتم خلال نفس اليوم إذا تم الطلب:
              <ul className="list-disc pr-6 mt-1">
                <li>قبل الساعة 3:00 مساءً في أيام العمل الرسمية.</li>
              </ul>
            </li>
            <li>الطلبات التي يتم تأكيدها بعد الساعة 3:00 مساءً:
              <ul className="list-disc pr-6 mt-1">
                <li>تُجهز وتُرسل في اليوم التالي.</li>
              </ul>
            </li>
          </ul>
          <h2 className="text-xl font-semibold text-[#4a60e9] mb-2">آلية التوصيل:</h2>
          <ul className="list-disc pr-6 mb-4 text-gray-700 space-y-1">
            <li>بعد تأكيد الطلب، يقوم مندوبنا بجمع القطعة المطلوبة</li>
            <li>يتم فحص القطعة في مركز الفحص المعتمد الخاص بنا في (الصناعية القديمة).</li>
            <li>تُسلم القطعة لشركة التوصيل المعتمدة، وتصل للعميل خلال 2 إلى 4 ساعات بعد الفحص، حسب التوقيت.</li>
            <li>سعر التوصيل ثابت داخل الرياض، ويظهر للعميل عند إنهاء الطلب.</li>
          </ul>
          <h1 className="text-2xl font-bold text-[#4a60e9] mb-6 mt-10">سياسة الاسترجاع والاستبدال</h1>
          <p className="mb-4 text-gray-700">نحرص على ضمان رضا العملاء وجودة القطع المستخدمة.</p>
          <h2 className="text-xl font-semibold text-[#4a60e9] mb-2">الشروط:</h2>
          <ul className="list-disc pr-6 mb-4 text-gray-700 space-y-1">
            <li>يمكن استرجاع أو استبدال القطعة خلال 48 ساعة من الاستلام في الحالات التالية:
              <ul className="list-disc pr-6 mt-1">
                <li>إذا كانت القطعة مختلفة عن الوصف أو الصور.</li>
                <li>إذا كانت القطعة معطوبة أو لا تعمل رغم اجتيازها الفحص.</li>
                <li>يجب أن تكون القطعة بحالتها الأصلية وغير مركبة أو معدلة.</li>
              </ul>
            </li>
            <li>يتحمل العميل تكلفة الشحن في حالة الاسترجاع أو الاستبدال، ما لم يكن الخطأ من البائع أو الموقع.</li>
          </ul>
          <h2 className="text-xl font-semibold text-[#4a60e9] mb-2">لا يُقبل الاسترجاع في الحالات التالية:</h2>
          <ul className="list-disc pr-6 mb-4 text-gray-700 space-y-1">
            <li>تلف القطعة بسبب التركيب الخاطئ.</li>
            <li>مرور أكثر من 48 ساعة على الاستلام.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DeliveryPolicy