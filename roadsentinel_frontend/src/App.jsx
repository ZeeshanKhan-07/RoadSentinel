import { useState } from 'react'
import './index.css'
import Login from './pages/login/login'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/dashboard'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster position='top-right'/>
    <Navbar />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
    </>
  )
}

export default App
