import React from "react";
import { Document, Page } from "react-pdf";

const InspectionForm = ({
  selectedOrder,
  inspectorPhone,
  inspectorNotes,
  onPhoneChange,
  onNotesChange,
  onFileChange,
  file,
  fileError,
  numPages,
  setNumPages,
  pageNumber,
  setPageNumber,
  submitInspection,
}) => {
  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="text-xl mb-4">نموذج الفحص للطلب: {selectedOrder._id}</h2>
      <div className="mb-4">
        <label className="block mb-1">رقم هاتف الفاحص:</label>
        <input
          type="text"
          className="w-full p-2 border"
          value={inspectorPhone}
          onChange={onPhoneChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">ملاحظات الفاحص:</label>
        <textarea
          className="w-full p-2 border"
          value={inspectorNotes}
          onChange={onNotesChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-1">تحميل تقرير الفحص (PDF):</label>
        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="w-full"
        />
        {fileError && <p className="text-red-600 mt-2">{fileError}</p>}
      </div>
      {file && (
        <div className="border mt-4 p-2">
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <div className="flex justify-between mt-2">
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-2 py-1 bg-gray-200"
            >
              الصفحة السابقة
            </button>
            <span>
              الصفحة {pageNumber} من {numPages}
            </span>
            <button
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
              disabled={pageNumber >= numPages}
              className="px-2 py-1 bg-gray-200"
            >
              الصفحة التالية
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => submitInspection("passed")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          اجتاز الفحص
        </button>
        <button
          onClick={() => submitInspection("failed")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          لم يجتز الفحص
        </button>
      </div>
    </div>
  );
};

export default InspectionForm;
