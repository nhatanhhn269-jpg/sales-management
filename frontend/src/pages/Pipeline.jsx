import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, updateCustomerStatus } from '../api';

const COLUMNS = [
  { key: 'NEW', label: 'Mới', color: 'border-blue-400 bg-blue-50' },
  { key: 'CONSULTING', label: 'Đang tư vấn', color: 'border-yellow-400 bg-yellow-50' },
  { key: 'QUOTED', label: 'Đã báo giá', color: 'border-orange-400 bg-orange-50' },
  { key: 'CLOSED', label: 'Chốt đơn ✅', color: 'border-green-400 bg-green-50' },
  { key: 'LOST', label: 'Từ chối ❌', color: 'border-red-400 bg-red-50' },
];

export default function Pipeline() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const load = () => getCustomers().then((r) => setCustomers(r.data));

  useEffect(() => { load(); }, []);

  const handleMove = async (customerId, newStatus) => {
    await updateCustomerStatus(customerId, newStatus);
    load();
  };

  const byStatus = (status) => customers.filter((c) => c.status === status);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pipeline Tư vấn</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.key} className={`min-w-[200px] w-52 border-t-4 rounded-xl ${col.color} flex-shrink-0`}>
            <div className="px-3 py-2 font-semibold text-sm flex justify-between items-center">
              <span>{col.label}</span>
              <span className="bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {byStatus(col.key).length}
              </span>
            </div>
            <div className="p-2 space-y-2 min-h-[300px]">
              {byStatus(col.key).map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition"
                  onClick={() => navigate(`/customers/${c.id}`)}
                >
                  <p className="font-medium text-gray-800 text-sm">{c.name}</p>
                  <p className="text-gray-500 text-xs">{c.phone}</p>
                  {c.orders?.length > 0 && (
                    <p className="text-green-600 text-xs mt-1">{c.orders.length} đơn hàng</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {COLUMNS.filter((cc) => cc.key !== col.key).map((cc) => (
                      <button
                        key={cc.key}
                        onClick={(e) => { e.stopPropagation(); handleMove(c.id, cc.key); }}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded"
                      >
                        → {cc.label.replace(' ✅', '').replace(' ❌', '')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
