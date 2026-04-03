## 1. Tổng Quan 
Link website mẫu: https://contact-management-beta-thaovo.vercel.app/

Nhiệm vụ của bạn là xây dựng một ứng dụng **Quản Lý Danh Bạ (Contact Directory)** hoàn chỉnh, cho phép người dùng:

* Xem danh sách danh bạ
* Tìm kiếm danh bạ
* Thêm / Sửa / Xóa danh bạ
* Xử lý đầy đủ trạng thái loading / success / error

Ứng dụng PHẢI làm giống giao diện website mẫu (spacing, button, layout, states) và xử lý đúng tất cả các case success / error tương ứng với API.

❗ Không sử dụng framework (React, Vue,…)
❗ Chỉ dùng HTML + CSS (Tailwind optional) + JavaScript thuần

---

## 2. Công Nghệ Được Phép Sử Dụng

* HTML5
* CSS3 hoặc Tailwind CSS (CDN)
* JavaScript (ES6)
* Fetch API
* Không dùng framework / library

---

## 3. API Specification (BẮT BUỘC DÙNG ĐÚNG)

**Base URL**
https://687f4c3aefe65e52008922e1.mockapi.io/user/directory

### Endpoints

| Method | Endpoint       | Mô tả                  |
| ------ | -------------- | ---------------------- |
| GET    | /directory     | Lấy danh sách danh bạ  |
| GET    | /directory/:id | Lấy chi tiết 1 danh bạ |
| POST   | /directory     | Tạo mới danh bạ        |
| PUT    | /directory/:id | Cập nhật danh bạ       |
| DELETE | /directory/:id | Xóa danh bạ            |
