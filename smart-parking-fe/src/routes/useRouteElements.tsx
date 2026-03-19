import { useRoutes, Navigate, Outlet } from 'react-router-dom';

// Import Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';

// Import Pages (Admin)
import LoginPage from '../pages/admin/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';

// Import Pages (Public)
import HomePage from '../pages/public/HomePage';
import SessionsPage from '../pages/admin/SessionsPage';
import RevenuePage from '../pages/admin/RevenuePage';
import { useAuth } from '../features/auth/AuthContext';

// --- 🛡️ GUARDS ---

// 1. Component bảo vệ: Yêu cầu đăng nhập để vào trang Admin
const AdminProtectedRoute = () => {
  const { session } = useAuth();
  // Nếu có session (đã login) thì cho vào Outlet, ngược lại đá văng ra Login
  return session ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

// 2. Component từ chối: Đã đăng nhập Admin rồi thì không cho vào trang Login nữa
const AdminRejectedRoute = () => {
  const { session } = useAuth();
  // Nếu ĐÃ login thì không cho vào trang Login nữa, đá vào Dashboard
  return !session ? <Outlet /> : <Navigate to="/admin/slot" replace />;
};

// --- 🗺️ ROUTES CONFIG ---

export default function useRouteElements() {
  const routeElements = useRoutes([
    // ==========================================
    // VÙNG 1: PUBLIC (Trang xem sơ đồ bãi xe cho khách)
    // ==========================================
    {
      path: '/',
      element: <PublicLayout />,
      children: [
        {
          index: true, // index: true thay cho path: '' 
          element: <HomePage />
        }
      ]
    },

    // ==========================================
    // VÙNG 2: ADMIN AUTH (Chưa đăng nhập)
    // ==========================================
    {
      path: '/admin/login',
      element: <AdminRejectedRoute />,
      children: [
        {
          index: true,
          element: <LoginPage />
        }
      ]
    },

    // ==========================================
    // VÙNG 3: ADMIN PRIVATE (Đã đăng nhập)
    // ==========================================
    {
      path: '/admin',
      element: <AdminProtectedRoute />,
      children: [
        {
          path: '',
          element: <AdminLayout />, // Layout chứa Sidebar và Header quản trị
          children: [
            {
              index: true,
              element: <Navigate to="slot" replace /> // Tự động đá vào trang quản lý slot
            },
            {
              path: 'slot',
              element: <DashboardPage />
            },
            {
              path: 'parking-session',
              element: <SessionsPage />
            },
            {
              path: 'revenue',
              element: <RevenuePage />
            }
          ]
        }
      ]
    },

    // ==========================================
    // VÙNG 4: 404 CATCH ALL
    // ==========================================
    { 
      path: '*', 
      element: <div className="flex justify-center items-center h-screen text-2xl font-bold">404 Not Found</div> 
    }
  ]);

  return routeElements;
}