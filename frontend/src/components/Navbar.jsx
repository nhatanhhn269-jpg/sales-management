import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/customers', label: 'Khách hàng' },
  { to: '/pipeline', label: 'Pipeline' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <nav className="bg-blue-700 text-white px-6 py-3 flex items-center gap-8 shadow">
        <span className="font-bold text-lg tracking-tight">SalesTrack</span>
        <div className="flex gap-4 flex-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1 rounded transition ${
                pathname === l.to ? 'bg-blue-500 font-semibold' : 'hover:bg-blue-600'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {auth?.user?.role === 'ADMIN' && (
            <Link
              to="/users"
              className={`px-3 py-1 rounded transition ${
                pathname === '/users' ? 'bg-blue-500 font-semibold' : 'hover:bg-blue-600'
              }`}
            >
              Tài khoản
            </Link>
          )}
        </div>
        <div className="relative ml-auto">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm transition"
          >
            <span>{auth?.user?.username}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg py-1 z-40 text-gray-700 text-sm">
              <button
                onClick={() => { setShowChangePw(true); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
              >
                Đổi mật khẩu
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </nav>
      {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}
    </>
  );
}
