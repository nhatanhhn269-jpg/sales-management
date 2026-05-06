# SalesTrack — Quản lý bán hàng

Web app CRM full-stack để quản lý khách hàng, theo dõi pipeline tư vấn và lịch sử đơn hàng.

## Tính năng

- Quản lý thông tin khách hàng (thêm, sửa, xóa)
- Pipeline Kanban: Mới → Tư vấn → Báo giá → Chốt đơn / Từ chối
- Phân loại khách tự động: Mới / Cũ / Quay lại / VIP
- Lịch sử đơn hàng và tổng doanh thu từng khách
- Dashboard thống kê: tỷ lệ chốt đơn, doanh thu tháng, khách theo loại

## Tech Stack

| Layer    | Công nghệ                        |
|----------|----------------------------------|
| Frontend | React + Vite + Tailwind CSS      |
| Backend  | Node.js + Express                |
| Database | SQLite via Prisma ORM            |
| Deploy   | Vercel (FE) + Railway (BE)       |

## Cài đặt local

### Backend
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js   # thêm dữ liệu mẫu (tuỳ chọn)
node server.js        # chạy trên port 3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev           # chạy trên port 5173
```

Mở trình duyệt tại `http://localhost:5173`

## Biến môi trường

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
PORT=3001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```
