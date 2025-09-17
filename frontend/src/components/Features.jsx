// Features.js
import React from "react";
import { CheckCircle, FileText, ShoppingBag, Shield, Truck, Star } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <CheckCircle size={32} strokeWidth={2.5} />,
      title: "ميزة “الفحص قبل التوصيل”",
      description: "يتم فحص جميع القطع الموجودة في المخزن قبل التوصيل، لضمان أن كل قطعة غيار تصل إليك مؤكدة وجاهزة للتركيب."
    },
    {
      icon: <FileText size={32} strokeWidth={2.5} />,
      title: "تقارير مفصلة عن المنتجات",
      description: "استعرض معلومات دقيقة حول كل قطعة غيار مثل المواصفات، مدى التوافق، وتجارب المستخدمين لمساعدتك في اتخاذ القرار الصحيح."
    },
    {
      icon: <ShoppingBag size={32} strokeWidth={2.5} />,
      title: "كل ما تحتاجه في مكان واحد",
      description: "وفر وقتك وجهدك بالوصول إلى مجموعة شاملة من قطع الغيار الأصلية والبديلة، مباشرة من مكان واحد وبسهولة تامة."
    },
    {
      icon: <Shield size={32} strokeWidth={2.5} />,
      title: "ضمان الجودة",
      description: "نضمن لك أعلى جودة لجميع المنتجات المقدمة، مع إمكانية الإرجاع خلال 14 يومًا في حال عدم الرضا."
    },
    {
      icon: <Truck size={32} strokeWidth={2.5} />,
      title: "توصيل سريع",
      description: "نوفر خدمة توصيل سريعة وموثوقة لجميع مناطق المملكة، مع إمكانية تتبع الطلبية لحين وصولها إليك."
    },
    {
      icon: <Star size={32} strokeWidth={2.5} />,
      title: "دعم فني متخصص",
      description: "فريق من الخبراء جاهز لمساعدتك في اختيار القطع المناسبة لسيارتك والإجابة على جميع استفساراتك الفنية."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        <div className="text-center mb-16" dir="rtl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            لماذا تختار كراجات؟
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            كراجات توفر لك كل ما تحتاجه سيارتك من قطع الغيار بسهولة وسرعة، دون
            التعقيدات المعتادة. منصتنا مصممة خصيصًا لتلبية احتياجات مالكي
            السيارات الحديثة ومحترفي الصيانة، لتجربة شراء سلسة وموثوقة.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 ml-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;