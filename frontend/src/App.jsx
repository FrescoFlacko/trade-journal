import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { TradeLog } from '@/pages/TradeLog';
import { NewTrade } from '@/pages/NewTrade';
import { EditTrade } from '@/pages/EditTrade';
import { Analytics } from '@/pages/Analytics';
import { Strategies } from '@/pages/Strategies';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="log" element={<TradeLog />} />
        <Route path="new-trade" element={<NewTrade />} />
        <Route path="edit-trade/:tradeId" element={<EditTrade />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="strategies" element={<Strategies />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
