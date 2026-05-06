import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, deleteCustomer, createCustomer } from '../api';

const TYPE_LABELS = { NEW: 'Mới', OLD: 'Cũ', RETURNING: 'Quay lại', VIP: 'VIP' };
const TYPE_COLORS = {
  NEW: 'bg-blue-100 text-blue-700',
  OLD: 'bg-gray-100 text-gray-700',
  RETURNING: 'bg-yellow-100 text-yellow-700',
  VIP: 'bg-purple-100 text-purple-700',
};
const STATUS_LABELS = {
  NEW: 'Mới', CONSULTING: 'Đang tư vấn', QUOTED: 'Báo giá', CLOSED: 'Chốt đơn', LOST: 'Từ chối',
};

const SOURCES = ['Tự tìm tới', 'Được giới thiệu', 'Ads ánh', 'Ads trang', 'Chào khách'];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'Khác', notes: '' });
  const navigate = useNavigate();

  const load = () => {
    getCustomers({ search, type: filterType }).then((r) => setCustomers(r.data));
  };

  useEffect(() => { load(); }, [search, filterType]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Xóa khách hàng này?')) return;
    await deleteCustomer(id);
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCustomer(form);
    setForm({ name: '', phone: '', email: '', source: 'Khác', notes: '' });
    setShowForm(false);
    load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Khách hàng</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Thêm khách hàng
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tên, số điện thoại..."
          className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Tất cả loại</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-4">Thêm khách hàng mới</h2>
            {[
              { label: 'Họ tên *', key: 'name', required: true },
              { label: 'Số điện thoại *', key: 'phone', required: true },
              { label: 'Email', key: 'email' },
            ].map(({ label, key, required }) => (
              <div key={key} className="mb-3">
                <label className="text-sm text-gray-600">{label}</label>
                <input
                  required={required}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="text-sm text-gray-600">Nguồn</label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              >
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-600">Ghi chú</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1"
                rows={2}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border">Hủy</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Thêm</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Tên</th>
              <th className="px-4 py-3 text-left">SĐT</th>
              <th className="px-4 py-3 text-left">Nguồn</th>
              <th className="px-4 py-3 text-left">Loại</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-left">Đơn hàng</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/customers/${c.id}`)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                <td className="px-4 py-3 text-gray-600">{c.source}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[c.type]}`}>
                    {TYPE_LABELS[c.type]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{STATUS_LABELS[c.status]}</td>
                <td className="px-4 py-3 text-gray-600">{c.orders?.length || 0}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => handleDelete(c.id, e)}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">Chưa có khách hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
