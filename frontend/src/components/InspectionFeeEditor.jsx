import React from "react";

const InspectionFeeEditor = ({ fee, setFee, saveFee }) => {
  return (
    <div className="my-4 border rounded p-4">
      <h2 className="text-lg mb-2">إعداد رسوم الفحص</h2>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="border p-2"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <button
          onClick={saveFee}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          حفظ
        </button>
      </div>
    </div>
  );
};

export default InspectionFeeEditor;
