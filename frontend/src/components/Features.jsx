import React from "react";

const Features = () => {
  return (
    <div>
      <section id="features">
        {/* Flex Container */}
        <div className="container flex flex-col px-4 mx-auto mt-10 space-y-12 md:space-y-0 md:flex-row mb-10">
          <div className="flex flex-col space-y-8 md:w-1/2" dir="rtl">
            {/* List Item 1 */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-reverse md:space-x-6 md:flex-row-reverse">
              {/* Heading */}
              <div className="rounded-r-full bg-brightSupBlue md:bg-transparent">
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="px-4 py-2 text-white rounded-full md:py-1 bg-babyJanaBlue">
                    ١
                  </div>
                  <h3 className="text-base font-bold md:mb-4 md:hidden">
                    تتبع حالة الطلبات بسهولة
                  </h3>
                </div>
              </div>
              <div>
                <h3 className="hidden mb-4 text-lg font-bold md:block">
                  تتبع حالة الطلبات بسهولة
                </h3>
                <p className="text-darkGrayishBlue">
                  اعرف حالة طلباتك في أي وقت وتابع مراحل الشحن والتوصيل بكل
                  وضوح، دون الحاجة للتواصل المستمر مع الدعم.
                </p>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-reverse md:space-x-6 md:flex-row-reverse">
              {/* Heading */}
              <div className="rounded-r-full bg-brightSupBlue md:bg-transparent">
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="px-4 py-2 text-white rounded-full md:py-1 bg-babyJanaBlue">
                    ٢
                  </div>
                  <h3 className="text-base font-bold md:mb-4 md:hidden">
                    تقارير مفصلة عن المنتجات
                  </h3>
                </div>
              </div>
              <div>
                <h3 className="hidden mb-4 text-lg font-bold md:block">
                  تقارير مفصلة عن المنتجات
                </h3>
                <p className="text-darkGrayishBlue">
                  استعرض معلومات دقيقة حول كل قطعة غيار مثل المواصفات، مدى
                  التوافق، وتجارب المستخدمين لمساعدتك في اتخاذ القرار الصحيح.
                </p>
              </div>
            </div>

            {/* List Item 3 */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:space-x-reverse md:space-x-6 md:flex-row-reverse">
              {/* Heading */}
              <div className="rounded-r-full bg-brightSupBlue md:bg-transparent">
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="px-4 py-2 text-white rounded-full md:py-1 bg-babyJanaBlue">
                    ٣
                  </div>
                  <h3 className="text-base font-bold md:mb-4 md:hidden">
                    كل ما تحتاجه في مكان واحد
                  </h3>
                </div>
              </div>
              <div>
                <h3 className="hidden mb-4 text-lg font-bold md:block">
                  كل ما تحتاجه في مكان واحد
                </h3>
                <p className="text-darkGrayishBlue">
                  وفر وقتك وجهدك بالوصول إلى مجموعة شاملة من قطع الغيار الأصلية
                  والبديلة، مباشرة من مكان واحد وبسهولة تامة.
                </p>
              </div>
            </div>
          </div>

          {/* What's Different */}
          <div className="flex flex-col space-y-12 md:w-1/2" dir="rtl">
            <h2 className="max-w-md text-4xl font-bold text-center md:text-right">
              لماذا تختار كراجات؟
            </h2>
            <p className="max-w-sm text-center text-darkGrayishBlue md:text-right">
              كراجات توفر لك كل ما تحتاجه سيارتك من قطع الغيار بسهولة وسرعة، دون
              التعقيدات المعتادة. منصتنا مصممة خصيصًا لتلبية احتياجات مالكي
              السيارات الحديثة ومحترفي الصيانة، لتجربة شراء سلسة وموثوقة.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
