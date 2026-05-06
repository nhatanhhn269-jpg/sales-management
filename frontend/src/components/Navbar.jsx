import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/customers', label: 'Khách hàng' },
  { to: '/pipeline', label: 'Pipeline' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center gap-8 shadow">
      <span className="font-bold text-lg tracking-tight">SalesTrack</span>
      <div className="flex gap-4">
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
      </div>
    </nav>
  );
}
