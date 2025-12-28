import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserDashboard from './pages/user/UserDashboard'
import HomePage from './pages/user/HomePage'
import MyProductsPage from './pages/user/MyProductsPage'
import AddProductPage from './pages/user/AddProductPage'
import ProfilePage from './pages/user/ProfilePage'
import AddCategoryPage from './pages/admin/AddCategoryPage'
import CategoriesManagementPage from './pages/admin/CategoriesManagementPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CategoriesManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories/new" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddCategoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/my-products" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyProductsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/add-product" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <AddProductPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/profile" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App

