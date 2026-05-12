import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const res = await getUsers();
    setUsers(res.data);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUser(form);
      setForm({ username: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Tạo tài khoản thất bại');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Xóa tài khoản này?')) return;
    await deleteUser(id);
    fetchUsers();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý tài khoản</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-5 mb-6 space-y-3">
        <h2 className="font-semibold text-lg">Thêm tài khoản mới</h2>
        <div className="flex gap-3">
          <input
            placeholder="Tên đăng nhập"
            className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition"
        >
          {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Tên đăng nhập</th>
              <th className="px-4 py-3 text-left">Vai trò</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.username}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id !== auth.user.id && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
