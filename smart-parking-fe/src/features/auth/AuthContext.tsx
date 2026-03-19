import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../services/supabaseClient'; // File kết nối Supabase em đã tạo

// Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
  session: Session | null;
}

// Khởi tạo Context
const AuthContext = createContext<AuthContextType>({ session: null });

// Kiểm tra xem có đang bật chế độ giả lập không
const isMockMode = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Provider để bọc ứng dụng
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // === LUỒNG MOCK DATA (GIẢ LẬP) ===
    if (isMockMode) {
      const mockSession = localStorage.getItem('mock_session');
      // Nếu có biến mock_session trong máy, giả vờ như đã có Token
      if (mockSession) {
        setSession({ user: { id: 'admin-mock' } } as any);
      } else {
        setSession(null);
      }
      setLoading(false);
      return; // Dừng luôn, không chạy code Supabase bên dưới nữa
    }

    // 1. Lấy trạng thái đăng nhập ngay khi mở web lên
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Lắng nghe mọi sự thay đổi (khi user bấm Login hoặc Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Cleanup khi component unmount
    return () => subscription.unsubscribe();
  }, []);

  // Trong lúc đang check token thì hiện màn hình loading trắng (hoặc spinner)
  if (loading) return <div className="h-screen flex items-center justify-center">Đang tải dữ liệu...</div>;

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để các component khác lấy dữ liệu dễ dàng hơn
export const useAuth = () => useContext(AuthContext);