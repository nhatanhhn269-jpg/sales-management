# CLAUDE.md

## Mô tả dự án

SalesTrack là web app CRM full-stack xây dựng bằng Claude Code. Mục đích: giúp người bán hàng quản lý khách hàng, theo dõi tiến trình tư vấn và lịch sử đơn hàng.

## Cấu trúc thư mục

```
sales-management/
├── backend/          Node.js + Express + Prisma + SQLite
│   ├── routes/       API endpoints
│   ├── prisma/       Schema + migrations + seed
│   └── server.js     Entry point (port 3001)
└── frontend/         React + Vite + Tailwind CSS
    └── src/
        ├── api/      Axios calls đến backend
        ├── components/
        └── pages/    Dashboard, Customers, CustomerDetail, Pipeline
```

## Các lệnh thường dùng

```bash
# Backend
cd backend
node server.js              # chạy server
npx prisma studio           # xem database qua giao diện
npx prisma db push          # sync schema vào DB
node prisma/seed.js         # thêm dữ liệu mẫu

# Frontend
cd frontend
npm run dev                 # dev server
npm run build               # build production
```

## Logic nghiệp vụ quan trọng

### Phân loại khách hàng (tự động cập nhật khi thêm/xóa đơn hàng)
- `NEW`: chưa có đơn hàng nào
- `OLD`: có 1 đơn hàng
- `RETURNING`: có 2+ đơn hàng
- `VIP`: tổng giá trị đơn ≥ 10,000,000đ

### Pipeline trạng thái tư vấn
`NEW` → `CONSULTING` → `QUOTED` → `CLOSED` hoặc `LOST`

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/customers | Danh sách (hỗ trợ `?search=` và `?type=`) |
| POST | /api/customers | Thêm khách mới |
| PUT | /api/customers/:id | Cập nhật thông tin |
| PATCH | /api/customers/:id/status | Cập nhật trạng thái tư vấn |
| DELETE | /api/customers/:id | Xóa khách |
| GET | /api/orders | Tất cả đơn hàng |
| POST | /api/orders | Thêm đơn (tự cập nhật type của khách) |
| DELETE | /api/orders/:id | Xóa đơn |
| GET | /api/dashboard/stats | Thống kê tổng quan |

## Lưu ý khi phát triển

- SQLite lưu tại `backend/prisma/dev.db` — không commit file này
- Frontend dùng `VITE_API_URL` để cấu hình URL backend
- Khi deploy, cập nhật `VITE_API_URL` sang URL Railway thật
