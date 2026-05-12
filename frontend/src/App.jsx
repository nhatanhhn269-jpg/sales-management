import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Pipeline from './pages/Pipeline';
import Users from './pages/Users';

function PrivateRoute({ children, adminOnly = false }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  if (adminOnly && auth.user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><Layout><Customers /></Layout></PrivateRoute>} />
          <Route path="/customers/:id" element={<PrivateRoute><Layout><CustomerDetail /></Layout></PrivateRoute>} />
          <Route path="/pipeline" element={<PrivateRoute><Layout><Pipeline /></Layout></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute adminOnly><Layout><Users /></Layout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
