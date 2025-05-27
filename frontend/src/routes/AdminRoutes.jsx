import AdminDash from '@/pages/AdminDash'
import React from 'react'
import { Route,Routes } from "react-router-dom";
const AdminRoutes = () => {
  return (
    <>
    <Routes>
      <Route path="/admin-dash" element={<AdminDash/>}/>
    </Routes>
    </>
  )
}

export default AdminRoutes
