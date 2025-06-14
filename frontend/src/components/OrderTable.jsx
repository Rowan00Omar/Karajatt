import React from "react";

const OrderTable = ({
  orders,
  showInspectedOnly,
  onOrderClick,
  selectedOrder,
}) => {
  const filteredOrders = showInspectedOnly
    ? orders.filter((order) => order.status === "inspected")
    : orders.filter((order) => order.status === "pending");

  return (
    <div className="overflow-x-auto max-h-[600px] overflow-y-auto border rounded p-2">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-right">اسم المشتري</th>
            <th className="p-2 text-right">رقم الهاتف</th>
            <th className="p-2 text-right">الأجزاء</th>
            <th className="p-2 text-right">حالة الطلب</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order._id}
              onClick={() => onOrderClick(order)}
              className={`cursor-pointer border-b hover:bg-gray-100 ${
                selectedOrder && selectedOrder._id === order._id
                  ? "bg-gray-100"
                  : ""
              }`}
            >
              <td className="p-2 text-right">{order.buyerName}</td>
              <td className="p-2 text-right">{order.buyerPhone}</td>
              <td className="p-2 text-right">
                <ul className="list-disc list-inside">
                  {order.parts.map((part) => (
                    <li key={part._id}>{part.name}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2 text-right">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
