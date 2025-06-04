# Skilllink

## Tổng quan

**Đồ án môn học:** Nhóm 11 - Website kết nối freelance với dự án
**Giảng viên hướng dẫn:** Ths. Trần Tuấn Dũng
**👨‍💻 Thành viên nhóm 11:**
| Vai trò       | Họ và Tên                                                                 | MSSV      |
|---------------|---------------------------------------------------------------------------|-----------|
| Trưởng nhóm   | [**Ngô Thái Vinh**](https://github.com/Vi-Alviss)                         | 23521791  |
| Thành viên 1  | [**Phạm Thanh Sơn**](https://github.com/PhamSonUIT)                       | 21522556  |
| Thành viên 2  | [**Lê Quốc Huy**](https://github.com/LQHtmt)                              | 23520615  |
| Thành viên 3  | [**Lê Phương Uyên**](https://github.com/PUynn)                            | 23521761  |
| Thành viên 4  | [**Lê Thị Tường Vy**](https://github.com/yvtg)                            | 23521828  |


## Giới thiệu sơ lược
**Skillink** là website kết nối freelancer với các dự án do các cá nhân hoặc công ty tuyển dụng, giúp freelancer tìm việc và nhà tuyển dụng tìm nhân lực nhanh chóng.
* Hỗ trợ đăng ký với nhiều phương thức, tạo hồ sơ nhanh chóng.
* Dễ dàng tìm kiếm công việc.
* Chat trực tiếp giữa freelancer và nhà tuyển dụng.
* AI Chatbot hỗ trợ 24/7.

## Yêu cầu cài đặt
- tải [Node.js](https://nodejs.org/en)
- tải [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Cài đặt
Clone dự án từ repository:
```shell
git clone https://github.com/Vi-Alviss/NT208-Nhom11.git
cd NT208-Nhom11
```

Tạo file .env trong thư mục backend (dựa trên .env.example):
```shell
cp backend/.env.example backend/.env
```
Tạo file .env trong thư mục frontend/web (dựa trên .env.example):
```shell
cp frontend/web/.env.example frontend/web/.env
```

Sau đó chỉnh sửa các giá trị trong file .env theo cấu hình của bạn.

## Run the web
Backend
```shell
cd backend
npm install
npm run start
```
Front end
```shell
cd frontend/web
npm install
npm run start
```

Truy cập ứng dụng:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API doc: http://localhost:3000/api-docs


