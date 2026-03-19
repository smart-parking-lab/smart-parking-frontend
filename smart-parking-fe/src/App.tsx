import { ToastContainer } from 'react-toastify';
// Import custom hook chứa cấu hình route mà chúng ta đã viết
import useRouteElements from './routes/useRouteElements'; 

function App() {
  // Gọi hook để lấy cây DOM của route hiện tại
  const routeElements = useRouteElements();

  return (
    <>
      {/* Nơi render giao diện của các trang dựa trên URL */}
      {routeElements}

      {/* Global Component: Hiển thị thông báo (Toast) trên toàn hệ thống */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
      />
    </>
  );
}

export default App;