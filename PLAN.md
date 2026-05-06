# PLAN.md — Sales Management Web App

## Tổng quan dự án

Xây dựng một web app CRM (Customer Relationship Management) đơn giản để quản lý khách hàng, theo dõi tình trạng tư vấn chốt đơn, phân loại khách hàng mới/cũ và lịch sử mua hàng.

---

## Mục tiêu (MVP)

- Quản lý thông tin khách hàng (thêm, sửa, xóa)
- Theo dõi trạng thái tư vấn theo dạng pipeline
- Phân loại khách hàng: Mới / Cũ / Quay lại / VIP
- Dashboard tổng quan: số liệu khách hàng, tỷ lệ chốt đơn, doanh thu
- Lịch sử đơn hàng của từng khách

---

## Tech Stack

| Layer      | Công nghệ                        |
|------------|----------------------------------|
| Frontend   | React + Vite + Tailwind CSS      |
| Backend    | Node.js + Express                |
| Database   | SQLite (via Prisma ORM)          |
| Auth       | JWT (JSON Web Token)             |
| Deploy FE  | Vercel                           |
| Deploy BE  | Railway                          |

---

## Cấu trúc thư mục

```
sales-management/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerCard.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── CustomerDetail.jsx
│   │   │   └── Orders.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   │   ├── customers.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
│
├── PLAN.md
├── CLAUDE.md
└── README.md
```

---

## Database Schema

### Bảng `Customer`
| Field        | Type     | Mô tả                                      |
|--------------|----------|--------------------------------------------|
| id           | Int (PK) | ID tự tăng                                 |
| name         | String   | Họ tên khách hàng                          |
| phone        | String   | Số điện thoại                              |
| email        | String?  | Email (không bắt buộc)                     |
| source       | String   | Nguồn: Facebook, Zalo, Giới thiệu...       |
| type         | Enum     | NEW / RETURNING / VIP                      |
| status       | Enum     | NEW / CONSULTING / QUOTED / CLOSED / LOST  |
| notes        | String?  | Ghi chú                                    |
| createdAt    | DateTime | Ngày tạo                                   |

### Bảng `Order`
| Field       | Type     | Mô tả                    |
|-------------|----------|--------------------------|
| id          | Int (PK) | ID tự tăng               |
| customerId  | Int (FK) | Liên kết với Customer    |
| amount      | Float    | Giá trị đơn hàng         |
| product     | String   | Tên sản phẩm/dịch vụ     |
| orderDate   | DateTime | Ngày đặt hàng            |
| notes       | String?  | Ghi chú                  |

---

## Phân loại khách hàng (Logic)

```
Khách MỚI      → chưa có đơn hàng nào
Khách CŨ       → đã có ít nhất 1 đơn hàng
Khách QUAY LẠI → đã có 2+ đơn hàng
Khách VIP      → tổng giá trị đơn hàng > 10,000,000đ
```

---

## Pipeline Trạng thái tư vấn

```
[MỚI] → [ĐANG TƯ VẤN] → [ĐÃ BÁO GIÁ] → [CHỐT ĐƠN ✅]
                                        ↘ [TỪ CHỐI ❌]
```

---

## API Endpoints

### Customers
| Method | Endpoint              | Mô tả                        |
|--------|-----------------------|------------------------------|
| GET    | /api/customers        | Lấy danh sách khách hàng     |
| GET    | /api/customers/:id    | Lấy chi tiết 1 khách hàng    |
| POST   | /api/customers        | Thêm khách hàng mới          |
| PUT    | /api/customers/:id    | Cập nhật thông tin           |
| DELETE | /api/customers/:id    | Xóa khách hàng               |
| PATCH  | /api/customers/:id/status | Cập nhật trạng thái tư vấn |

### Orders
| Method | Endpoint              | Mô tả                        |
|--------|-----------------------|------------------------------|
| GET    | /api/orders           | Lấy tất cả đơn hàng          |
| GET    | /api/orders/:customerId | Lấy đơn hàng theo khách    |
| POST   | /api/orders           | Thêm đơn hàng mới            |

### Dashboard
| Method | Endpoint              | Mô tả                        |
|--------|-----------------------|------------------------------|
| GET    | /api/dashboard/stats  | Thống kê tổng quan           |

---

## Các trang giao diện

| Trang           | Mô tả                                              |
|-----------------|----------------------------------------------------|
| `/`             | Dashboard: tổng quan số liệu, biểu đồ             |
| `/customers`    | Danh sách khách hàng + tìm kiếm + lọc             |
| `/customers/:id`| Chi tiết khách hàng + lịch sử đơn hàng           |
| `/pipeline`     | Kanban board trạng thái tư vấn                    |

---

## Kế hoạch thực hiện

### Giai đoạn 1 — Backend (Ngày 1)
- [ ] Khởi tạo project Node.js + Express
- [ ] Cài đặt Prisma + SQLite
- [ ] Tạo database schema
- [ ] Viết API CRUD cho Customer
- [ ] Viết API cho Order
- [ ] Viết API Dashboard stats

### Giai đoạn 2 — Frontend (Ngày 2)
- [ ] Khởi tạo React + Vite + Tailwind
- [ ] Trang danh sách khách hàng
- [ ] Form thêm / sửa khách hàng
- [ ] Trang chi tiết khách hàng
- [ ] Kanban pipeline board
- [ ] Dashboard với số liệu thống kê

### Giai đoạn 3 — Hoàn thiện & Deploy (Ngày 3)
- [ ] Connect frontend với backend API
- [ ] Xử lý lỗi và loading state
- [ ] Deploy backend lên Railway
- [ ] Deploy frontend lên Vercel
- [ ] Kiểm tra toàn bộ tính năng
- [ ] Viết README.md và CLAUDE.md

---

## Tiêu chí hoàn thành

- [ ] App chạy được trên URL public
- [ ] Thêm / sửa / xóa khách hàng hoạt động
- [ ] Cập nhật trạng thái tư vấn hoạt động
- [ ] Phân loại khách mới/cũ/VIP đúng
- [ ] Dashboard hiển thị số liệu chính xác
- [ ] Code trên GitHub (public repo)
- [ ] Có đầy đủ README.md, CLAUDE.md, PLAN.md
