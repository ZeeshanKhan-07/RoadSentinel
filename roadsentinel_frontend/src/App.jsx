import { useState } from 'react'
import './index.css'
import Login from './pages/login/login'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar'
import RegisterPage from './pages/register/register'
import Home from './pages/home/home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster position='top-right'/>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/profile" element={<Dashboard/>} />
      <Route path="register" element={<RegisterPage/>} />
    </Routes>
    </>
  )
}

export default App
