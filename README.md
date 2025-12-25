# Secondhand Website Client

Frontend ứng dụng website bán đồ cũ được xây dựng với React + TypeScript + Vite.

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Build

```bash
npm run build
```

## Tính năng

- ✅ Trang đăng nhập với validation
- ✅ Trang đăng ký với validation
- ✅ Giao diện đẹp, responsive
- ✅ Tích hợp với API backend
- ✅ Áp dụng mô hình MVVM (Model-View-ViewModel)

## Kiến trúc MVVM

Ứng dụng được xây dựng theo mô hình **MVVM** để tách biệt logic và giao diện:

### Model
- Định nghĩa các data structures và types
- Nằm trong `src/models/`
- Ví dụ: `User.ts`, `Auth.ts`

### View
- Components React chỉ chịu trách nhiệm hiển thị UI
- Nằm trong `src/pages/`
- Không chứa business logic, chỉ gọi ViewModel

### ViewModel
- Custom hooks quản lý state và business logic
- Nằm trong `src/viewmodels/`
- Xử lý validation, API calls, state management
- Ví dụ: `useLoginViewModel.ts`, `useRegisterViewModel.ts`

### Service
- API calls và data fetching
- Nằm trong `src/services/`
- Được ViewModel sử dụng để tương tác với backend

## Cấu trúc thư mục

```
src/
  ├── models/         # Model - Data structures và types
  │   ├── User.ts
  │   └── Auth.ts
  ├── viewmodels/     # ViewModel - Business logic và state management
  │   ├── useLoginViewModel.ts
  │   └── useRegisterViewModel.ts
  ├── pages/          # View - UI components
  │   ├── LoginPage.tsx
  │   └── RegisterPage.tsx
  ├── services/       # API services
  │   └── api.ts
  ├── App.tsx         # Component chính
  └── main.tsx        # Entry point
```
