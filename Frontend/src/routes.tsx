// src/routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicMenu from './pages/Menu'
import Admin from './backoffice/Admin'
import AddCategory from './backoffice/AddCategory'
import AddMenuItem from './backoffice/AddMenuItem'

export default function AppRoutes() {
  return (
    <Routes>
      {/* site público */}
      <Route path="/" element={<PublicMenu />} />

      {/* backoffice */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/add_category" element={<AddCategory />} />
      <Route path="/admin/add_menuitem" element={<AddMenuItem/>} />

      {/* opcional: redirecionar /home -> / */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      {/* 404 */}
      <Route path="*" element={<div>404 - Página não encontrada</div>} />
    </Routes>
  )
}
