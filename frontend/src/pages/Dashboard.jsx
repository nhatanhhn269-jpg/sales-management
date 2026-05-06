import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';

const statCard = (label, value, color) => (
  <div key={label} className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const STATUS_LABELS = {
  NEW: 'Mới',
  CONSULTING: 'Đang tư vấn',
  QUOTED: 'Đã báo giá',
  CLOSED: 'Chốt đơn',
  LOST: 'Từ chối',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((r) => setStats(r.data));
  }, []);

  if (!stats) return <div className="p-8 text-gray-500">Đang tải...</div>;

  const fmt = (n) => n?.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tổng quan</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCard('Tổng khách hàng', stats.totalCustomers, 'border-blue-500')}
        {statCard('Khách mới', stats.newCustomers, 'border-green-500')}
        {statCard('Khách quay lại', stats.returningCustomers, 'border-yellow-500')}
        {statCard('Khách VIP', stats.vipCustomers, 'border-purple-500')}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCard('Đã chốt đơn', stats.closedDeals, 'border-emerald-500')}
        {statCard('Từ chối', stats.lostDeals, 'border-red-400')}
        {statCard('Tỷ lệ chốt', stats.conversionRate + '%', 'border-indigo-500')}
        {statCard('Tổng đơn hàng', stats.totalOrders, 'border-orange-400')}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Doanh thu tháng này</h2>
          <p className="text-3xl font-bold text-blue-600">{fmt(stats.monthlyRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Tổng doanh thu</h2>
          <p className="text-3xl font-bold text-green-600">{fmt(stats.totalRevenue)}</p>
        </div>
      </div>

      {stats.statusCounts?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5 mt-4">
          <h2 className="font-semibold text-gray-700 mb-3">Trạng thái tư vấn</h2>
          <div className="flex flex-wrap gap-3">
            {stats.statusCounts.map((s) => (
              <div key={s.status} className="bg-gray-100 rounded-lg px-4 py-2 text-sm">
                <span className="font-medium">{STATUS_LABELS[s.status] || s.status}</span>
                <span className="ml-2 text-gray-500">{s._count.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
