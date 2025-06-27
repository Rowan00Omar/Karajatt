import React, { useState, useEffect } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Helmet } from "react-helmet";

import {
  DocumentCheckIcon,
  DocumentTextIcon,
  PhoneIcon,
  XCircleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const InspectionManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [inspectorPhone, setInspectorPhone] = useState("");
  const [inspectorNotes, setInspectorNotes] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInspectedOnly, setShowInspectedOnly] = useState(false);
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);
  const [inspectionFee, setInspectionFee] = useState(49);
  const [isEditingFee, setIsEditingFee] = useState(false);
  const [feeError, setFeeError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchInspectionFee();
  }, []);

  const fetchInspectionFee = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFeeError("جلسة المستخدم منتهية. الرجاء تسجيل الدخول مرة أخرى");
        return;
      }

      const response = await axios.get("/api/admin/inspection/fee", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.fee !== undefined) {
        setInspectionFee(response.data.fee);
      } else {
        console.error("Invalid response format:", response.data);
        setFeeError("فشل في جلب رسوم الفحص. الرجاء تحديث الصفحة");
      }
    } catch (error) {
      console.error("Error fetching inspection fee:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setFeeError("فشل في جلب رسوم الفحص. الرجاء تحديث الصفحة");
    }
  };

  const handleFeeChange = async () => {
    const value = parseFloat(inspectionFee);
    if (isNaN(value) || value < 0) {
      setFeeError("الرجاء إدخال قيمة صحيحة");
      return;
    }
    setFeeError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFeeError("جلسة المستخدم منتهية. الرجاء تسجيل الدخول مرة أخرى");
        return;
      }

      const response = await axios.put(
        "/api/admin/inspection/fee",
        { fee: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setInspectionFee(value);
        setIsEditingFee(false);
      } else {
        setFeeError("فشل في تحديث رسوم الفحص. الرجاء المحاولة مرة أخرى");
      }
    } catch (error) {
      console.error("Error updating inspection fee:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "فشل في تحديث رسوم الفحص. الرجاء المحاولة مرة أخرى";
      setFeeError(errorMessage);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("جلسة المستخدم منتهية. الرجاء تسجيل الدخول مرة أخرى");
        return;
      }

      const response = await axios.get("/api/admin/inspection/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error.response?.data?.error?.sqlMessage ||
        error.response?.data?.message ||
        "فشل في جلب الطلبات. الرجاء المحاولة مرة أخرى";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInspection = async (orderId) => {
    try {
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("جلسة المستخدم منتهية. الرجاء تسجيل الدخول مرة أخرى");
        return;
      }

      await axios.post(
        `/api/admin/inspection/orders/${orderId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "pending" } : order
        )
      );

      const selectedOrder = orders.find((order) => order.id === orderId);
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status: "pending" });
      }
    } catch (error) {
      console.error("Error starting inspection:", error);
      const errorMessage =
        error.response?.data?.error?.sqlMessage ||
        error.response?.data?.message ||
        "فشل في بدء عملية الفحص. الرجاء المحاولة مرة أخرى";
      setError(errorMessage);

      fetchOrders();
    }
  };

  const validatePdfFile = (file) => {
    if (!file) {
      setUploadError("يرجى اختيار ملف");
      return false;
    }

    if (file.type !== "application/pdf") {
      setUploadError("يجب أن يكون الملف بصيغة PDF");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("حجم الملف يجب أن لا يتجاوز 10 ميجابايت");
      return false;
    }

    setUploadError("");
    return true;
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPdfError(null);
  }

  // Function to handle PDF loading error
  function onDocumentLoadError(error) {
    console.error("Error while loading document:", error);
    setPdfError("Failed to load PDF file");
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (validatePdfFile(file)) {
      setReportFile(file);

      const url = URL.createObjectURL(file);
      setPdfUrl(url);

      setPdfError(null);
      setUploadError("");
    } else {
      event.target.value = null;
      setReportFile(null);
      setPdfUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleSubmitReport = async (status) => {
    try {
      // Validate required fields
      if (!reportFile || !inspectorPhone) {
        setError("الرجاء تعبئة رقم هاتف الفاحص وإرفاق ملف التقرير");
        return;
      }

      // Validate phone number format (Saudi format)
      const phoneRegex = /^(05)[0-9]{8}$/;
      if (!phoneRegex.test(inspectorPhone)) {
        setError("رقم الهاتف يجب أن يبدأ ب 05 ويتكون من 10 أرقام");
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("جلسة المستخدم منتهية. الرجاء تسجيل الدخول مرة أخرى");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("report", reportFile);
      formData.append("inspectionStatus", status);
      formData.append("inspectorPhone", inspectorPhone);
      if (inspectorNotes && inspectorNotes.trim()) {
        formData.append("inspectorNotes", inspectorNotes.trim());
      }

      const response = await axios.post(
        `/api/admin/inspection/orders/${selectedOrder.id}/report`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data && response.data.reportUrl) {
        // Cleanup
        setSelectedOrder(null);
        setInspectorPhone("");
        setInspectorNotes("");
        setReportFile(null);
        setPdfUrl(null);
        setUploadProgress(0);
        await fetchOrders();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      let errorMessage = "فشل في رفع التقرير. ";

      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.status === 413) {
        errorMessage += "حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت";
      } else if (error.response?.status === 415) {
        errorMessage += "نوع الملف غير مدعوم. يرجى رفع ملف PDF فقط";
      } else {
        errorMessage += "الرجاء المحاولة مرة أخرى";
      }

      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadReport = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("جلسة المستخدم منتهية. الرجاء تسجيل الدخول مرة أخرى");
        return;
      }

      setDownloadingOrderId(orderId);
      setError(null);

      const response = await axios.get(
        `/api/admin/inspection/orders/${orderId}/report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        response.data.report &&
        response.data.report.report_file_path
      ) {
        // Open the Cloudinary URL in a new tab
        window.open(response.data.report.report_file_path, "_blank");
      } else {
        setError("تقرير الفحص غير موجود");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      if (error.response?.status === 404) {
        setError("تقرير الفحص غير موجود");
      } else {
        setError("فشل في تحميل التقرير. الرجاء المحاولة مرة أخرى");
      }
    } finally {
      setDownloadingOrderId(null);
    }
  };

  // Filter orders based on the toggle state
  const filteredOrders = React.useMemo(() => {
    return showInspectedOnly
      ? orders.filter(
          (order) => order.status === "passed" || order.status === "failed"
        )
      : orders.filter((order) => order.status === "pending");
  }, [orders, showInspectedOnly]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "passed":
        return {
          text: "تم الفحص - القطعة سليمة",
          className: "bg-green-100 text-green-800",
        };
      case "failed":
        return {
          text: "تم الفحص - القطعة غير صالحة",
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          text: "بانتظار الفحص",
          className: "bg-yellow-100 text-yellow-800",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>فحص الطلبات</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setShowInspectedOnly(!showInspectedOnly)}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                showInspectedOnly
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5 ml-2" />
              {showInspectedOnly ? "عرض الطلبات المعلقة" : "عرض الطلبات المفحوصة"}
            </button>
            {selectedOrder && (
              <button
                onClick={() => setSelectedOrder(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                العودة إلى القائمة
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-right">
            إدارة فحص الطلبات
          </h1>
        </div>

        {/* Inspection Fee Management */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CurrencyDollarIcon className="h-6 w-6 text-gray-500" />
              <h2 className="text-xl font-semibold">رسوم الفحص</h2>
            </div>
            {isEditingFee ? (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={inspectionFee}
                  onChange={(e) => setInspectionFee(e.target.value)}
                  className="w-32 border rounded-lg p-2 text-right"
                  min="0"
                  step="0.01"
                />
                <span className="text-gray-600">ر.س</span>
                <button
                  onClick={handleFeeChange}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  حفظ
                </button>
                <button
                  onClick={() => {
                    setIsEditingFee(false);
                    setFeeError("");
                    fetchInspectionFee(); // Reset to original value
                  }}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold">{inspectionFee} ر.س</span>
                <button
                  onClick={() => setIsEditingFee(true)}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                >
                  تعديل
                </button>
              </div>
            )}
          </div>
          {feeError && (
            <p className="text-red-500 text-sm mt-2 text-right">{feeError}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
            {error}
          </div>
        )}

        {selectedOrder ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-right">
                تقرير الفحص - طلب رقم {selectedOrder.id}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                  رقم هاتف الفاحص
                </label>
                <input
                  type="tel"
                  className="w-full border-gray-300 rounded-md shadow-sm text-right"
                  value={inspectorPhone}
                  onChange={(e) => setInspectorPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                  ملاحظات الفحص
                </label>
                <textarea
                  className="w-full border-gray-300 rounded-md shadow-sm text-right"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  rows="4"
                  dir="rtl"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                  تقرير الفحص (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative">
                  <div className="space-y-1 text-center">
                    {!reportFile ? (
                      <>
                        <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>اختر ملف PDF</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept=".pdf,application/pdf"
                              className="sr-only"
                              onChange={handleFileChange}
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF حتى 10 ميجابايت
                        </p>
                      </>
                    ) : (
                      <div className="w-full">
                        <p className="text-sm text-gray-600 mb-4">
                          تم اختيار: {reportFile.name}
                        </p>
                        {pdfUrl && (
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <Document
                              file={pdfUrl}
                              onLoadSuccess={onDocumentLoadSuccess}
                              onLoadError={onDocumentLoadError}
                              loading={
                                <div className="text-center py-4">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                  <p className="mt-2 text-sm text-gray-600">
                                    جاري تحميل الملف...
                                  </p>
                                </div>
                              }
                              error={
                                <div className="text-center py-4 text-red-600">
                                  <p>{pdfError || "حدث خطأ في تحميل الملف"}</p>
                                </div>
                              }
                            >
                              <Page
                                pageNumber={pageNumber}
                                width={300}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                              />
                            </Document>
                            {numPages > 0 && (
                              <div className="mt-2 flex justify-center items-center gap-4">
                                <button
                                  onClick={() =>
                                    setPageNumber(Math.max(1, pageNumber - 1))
                                  }
                                  disabled={pageNumber <= 1}
                                  className="px-2 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
                                >
                                  السابق
                                </button>
                                <p className="text-sm text-gray-600">
                                  صفحة {pageNumber} من {numPages}
                                </p>
                                <button
                                  onClick={() =>
                                    setPageNumber(
                                      Math.min(numPages, pageNumber + 1)
                                    )
                                  }
                                  disabled={pageNumber >= numPages}
                                  className="px-2 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
                                >
                                  التالي
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setReportFile(null);
                            setPdfUrl(null);
                            setNumPages(null);
                            setPageNumber(1);
                            setPdfError(null);
                          }}
                          className="mt-4 text-sm text-red-600 hover:text-red-800"
                        >
                          إزالة الملف
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {uploadError && (
                  <p className="text-sm text-red-600 flex items-center justify-end mt-2">
                    <ExclamationCircleIcon className="h-5 w-5 ml-1" />
                    {uploadError}
                  </p>
                )}
                {isUploading && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center mt-1">
                      {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleSubmitReport("failed")}
                  disabled={isUploading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <XCircleIcon className="h-5 w-5 ml-2" />
                  {isUploading ? "جاري الرفع..." : "القطعة غير صالحة"}
                </button>
                <button
                  onClick={() => handleSubmitReport("passed")}
                  disabled={isUploading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <CheckCircleIcon className="h-5 w-5 ml-2" />
                  {isUploading ? "جاري الرفع..." : "القطعة سليمة"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المشتري
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القطع المطلوبة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر الإجمالي
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const statusDisplay = getStatusDisplay(order.status);
                  const isDownloading = downloadingOrderId === order.id;

                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-medium text-gray-900">
                          {order.buyer_first_name} {order.buyer_last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="space-y-1">
                          {order.products?.map((product, index) => (
                            <div
                              key={`${order.id}-${product.title}-${index}`}
                              className="text-sm"
                            >
                              <div className="font-medium text-gray-900">
                                {product.title}
                              </div>
                              <div className="text-gray-500">
                                {product.part_name} (الكمية: {product.quantity})
                                <div className="text-xs text-gray-400">
                                  البائع: {product.seller_email}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {order.total_price} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {new Date(order.created_at).toLocaleDateString("ar", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          calendar: "gregory",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.className}`}
                        >
                          {statusDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.status === "pending" ? (
                          <button
                            onClick={() => handleStartInspection(order.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <DocumentCheckIcon className="h-4 w-4 ml-2" />
                            بدء الفحص
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDownloadReport(order.id)}
                            disabled={isDownloading}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                              isDownloading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <svg
                                  className="animate-spin h-4 w-4 ml-2"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                جاري التحميل...
                              </>
                            ) : (
                              <>
                                <DocumentTextIcon className="h-4 w-4 ml-2" />
                                تحميل التقرير
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default InspectionManagement;
