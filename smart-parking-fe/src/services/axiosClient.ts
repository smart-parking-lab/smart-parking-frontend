import axios from 'axios';
import { supabase } from './supabaseClient';
// Chúng ta không import toast ở đây để giữ code sạch

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 giây
});





// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  async(config) => {
    // Lấy token từ localStorage
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response) => {
    return response; 
  },
  async (error) => {
    // Xử lý lỗi 401 (Unauthorized) - Token sai hoặc hết hạn
    if (error.response?.status === 401) {
      // 3. Đăng xuất khỏi Supabase thay vì xóa localStorage thủ công
      await supabase.auth.signOut();
      
      // 4. Chuyển hướng về đúng trang login của Admin (Thêm /admin/ vào trước)
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;