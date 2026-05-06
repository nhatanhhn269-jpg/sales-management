import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomer, updateCustomerStatus, createOrder, deleteOrder } from '../api';

const STATUSES = [
  { key: 'NEW', label: 'Mới' },
  { key: 'CONSULTING', label: 'Đang tư vấn' },
  { key: 'QUOTED', label: 'Đã báo giá' },
  { key: 'CLOSED', label: 'Chốt đơn ✅' },
  { key: 'LOST', label: 'Từ chối ❌' },
];

const TYPE_COLORS = {
  NEW: 'bg-blue-100 text-blue-700',
  OLD: 'bg-gray-100 text-gray-700',
  RETURNING: 'bg-yellow-100 text-yellow-700',
  VIP: 'bg-purple-100 text-purple-700',
};
const TYPE_LABELS = { NEW: 'Mới', OLD: 'Cũ', RETURNING: 'Quay lại', VIP: 'VIP' };

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ product: '', amount: '', notes: '' });

  const load = () => getCustomer(id).then((r) => setCustomer(r.data));

  useEffect(() => { load(); }, [id]);

  const handleStatus = async (status) => {
    await updateCustomerStatus(id, status);
    load();
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    await createOrder({ customerId: id, ...orderForm });
    setOrderForm({ product: '', amount: '', notes: '' });
    setShowOrderForm(false);
    load();
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Xóa đơn hàng này?')) return;
    await deleteOrder(orderId);
    load();
  };

  if (!customer) return <div className="p-8 text-gray-500">Đang tải...</div>;

  const totalRevenue = customer.orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/customers')} className="text-blue-600 hover:underline mb-4 block">
        ← Quay lại
      </button>

      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-500">{customer.phone} {customer.email && `• ${customer.email}`}</p>
            <p className="text-gray-500 text-sm mt-1">Nguồn: {customer.source}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${TYPE_COLORS[customer.type]}`}>
            {TYPE_LABELS[customer.type]}
          </span>
        </div>
        {customer.notes && (
          <p className="mt-3 text-gray-600 bg-gray-50 rounded-lg p-3 text-sm">{customer.notes}</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="font-semibold text-gray-700 mb-3">Trạng thái tư vấn</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => handleStatus(s.key)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                customer.status === s.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:border-blue-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-700">
            Đơn hàng ({customer.orders.length})
            {totalRevenue > 0 && (
              <span className="ml-2 text-blue-600 font-bold">
                — {totalRevenue.toLocaleString('vi-VN')}đ
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowOrderForm(true)}
            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
          >
            + Thêm đơn
          </button>
        </div>

        {showOrderForm && (
          <form onSubmit={handleAddOrder} className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Sản phẩm *</label>
                <input
                  required
                  value={orderForm.product}
                  onChange={(e) => setOrderForm({ ...orderForm, product: e.target.value })}
                  className="w-full border rounded px-3 py-1.5 mt-1 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Giá trị (đ) *</label>
                <input
                  required
                  type="number"
                  value={orderForm.amount}
                  onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                  className="w-full border rounded px-3 py-1.5 mt-1 text-sm"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="text-sm text-gray-600">Ghi chú</label>
              <input
                value={orderForm.notes}
                onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                className="w-full border rounded px-3 py-1.5 mt-1 text-sm"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => setShowOrderForm(false)} className="px-3 py-1.5 border rounded text-sm">Hủy</button>
              <button type="submit" className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">Lưu</button>
            </div>
          </form>
        )}

        {customer.orders.length === 0 ? (
          <p className="text-gray-400 text-sm">Chưa có đơn hàng nào</p>
        ) : (
          <div className="space-y-2">
            {customer.orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border rounded-lg px-4 py-2.5">
                <div>
                  <p className="font-medium text-gray-800">{o.product}</p>
                  <p className="text-xs text-gray-500">{new Date(o.orderDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-green-700">{o.amount.toLocaleString('vi-VN')}đ</span>
                  <button onClick={() => handleDeleteOrder(o.id)} className="text-red-400 hover:text-red-600 text-xs">Xóa</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
