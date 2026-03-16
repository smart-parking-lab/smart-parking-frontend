# 📝 Frontend API Requirements & User Flows

Tài liệu này mô tả chi tiết luồng tương tác (User Flow) trên giao diện và các API Endpoints mà Frontend (FE) cần Backend (BE) cung cấp cho hệ thống Smart Parking.



---

## 1. Public Page (Trang chủ cho khách)
* **Route:** `/`
* **Mục tiêu:** Giúp khách hàng xem sơ đồ bãi đỗ xe và tìm chỗ trống theo thời gian thực.

### 📍 Luồng xử lý (Flow)
1. Người dùng truy cập trang chủ.
2. FE gọi API lấy toàn bộ trạng thái các ô đỗ để render sơ đồ (dựa vào `position_x`, `position_y`).
3. FE kết nối WebSockets/Supabase Realtime để lắng nghe sự kiện thay đổi trạng thái (có xe vào/ra) và cập nhật màu sắc ô đỗ tự động.

### 🔌 API Yêu cầu
**`GET /api/v1/slots/public`**
* **Mô tả:** Lấy danh sách ô đỗ xe cho khách (không yêu cầu token).
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "slot_code": "A01",
        "status": "available", // available, occupied, maintenance
        "position_x": 10,
        "position_y": 20
      }
    ]
  }

## 2. Admin Login (Đăng nhập quản trị)
* **Route:** `/admin/login`
* **Mục tiêu:** Xác thực quyền truy cập của Admin/Operator.

### 📍 Luồng xử lý (Flow)
1. Admin nhập email và password.
2. FE gửi request POST chứa thông tin đăng nhập lên hệ thống.
3. Nếu thành công, FE lưu Access Token vào Local Storage/Cookies và chuyển hướng (redirect) sang /admin/slot.

### 🔌 API Yêu cầu
**`POST /api/v1/auth/login`**
* **Lưu ý:** Nếu team dùng trực tiếp Supabase Auth trên FE, có thể bỏ qua API này và dùng SDK supabase.auth.signInWithPassword
* **Mô tả:** Lấy danh sách ô đỗ xe cho khách (không yêu cầu token).
* **Body Request:**
  ```json
  {
  "email": "admin@example.com",
  "password": "your_password"
  }
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "full_name": "Nguyen Van A",
      "role": "admin"
    }
  }

## 3. Admin Dashboard (Quản lý trạng thái slot)
* **Route:** `/admin/slot`
* **Mục tiêu:** Quản lý toàn diện bãi đỗ, xem trạng thái phần cứng (cảm biến).

### 📍 Luồng xử lý (Flow)
1. FE kiểm tra Token hợp lệ.
2. FE gọi API lấy danh sách slot kèm thông tin cảm biến.
3. Render bảng dữ liệu, cho phép lọc theo trạng thái (vd: chỉ xem các slot đang lỗi cảm biến).

### 🔌 API Yêu cầu
**`GET /api/v1/admin/slots`**
* **Mô tả:** Lấy danh sách slot và kết nối (JOIN) với bảng sensors. Yêu cầu Admin Token.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "slot_code": "A01",
        "slot_status": "occupied",
        "sensor": {
          "sensor_code": "IR_A01",
          "status": "online", // online, offline, error
          "last_heartbeat": "2026-03-16T15:00:00Z"
        }
      }
    ]
  }

## 4. Parking-Session Pages (Quản lý phiên xe ra vào) 
* **Route:** `/admin/parking-session`
* **Mục tiêu:** Kiểm tra lịch sử ra vào, đối chiếu hình ảnh nhận diện biển số (LPR).

### 📍 Luồng xử lý (Flow)
1. Truy cập trang, gọi API lấy danh sách phiên đỗ xe (mặc định lấy active và sắp xếp mới nhất).
2. Thanh tìm kiếm cho phép FE gọi lại API kèm query plate_number để tìm đúng xe.
3. Click vào từng dòng để xem popup phóng to ảnh entry_image_url và exit_image_url

### 🔌 API Yêu cầu
**`GET /api/v1/admin/sessions`**
* **Mô tả:** Lấy danh sách slot và kết nối (JOIN) với bảng sensors. Yêu cầu Admin Token.
* **Query Params (Tùy chọn):** ?page=1&limit=20&status=active&plate_number=59A
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "pagination": { "total": 150, "page": 1, "limit": 20 },
    "data": [
      {
        "id": "uuid",
        "plate_number": "59A-123.45",
        "entry_time": "2026-03-16T08:30:00Z",
        "exit_time": null,
        "status": "active", // active, completed
        "entry_image_url": "https://storage.../image1.jpg",
        "exit_image_url": null
      }
    ]
  }

## 5. Revenue Page (Quản lý doanh thu)
* **Route:** `/admin/revenue`
* **Mục tiêu:** Thống kê tài chính, hóa đơn đã thu phí.

### 📍 Luồng xử lý (Flow)
1. Trình bày UI chọn khoảng thời gian (DatePicker: Từ ngày - Đến ngày).
2. Khi đổi ngày, FE gọi API gửi startDate và endDate.
3. Nhận dữ liệu để vẽ biểu đồ doanh thu và hiển thị bảng chi tiết các hóa đơn (invoices).

### 🔌 API Yêu cầu
**`GET /api/v1/admin/revenue`**
* **Mô tả:** Lấy danh sách slot và kết nối (JOIN) với bảng sensors. Yêu cầu Admin Token.
* **Query Params:** ?startDate=2026-03-01&endDate=2026-03-16
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "summary": {
      "total_revenue": 5000000,
      "total_paid_invoices": 320
    },
    "invoices": [
      {
        "id": "uuid",
        "amount": 15000,
        "duration_minutes": 120,
        "payment_method": "momo", // cash, vnpay, momo
        "paid_at": "2026-03-16T10:00:00Z"
      }
    ]
  }
