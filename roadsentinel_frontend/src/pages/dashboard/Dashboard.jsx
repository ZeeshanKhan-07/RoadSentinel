import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../auth/store'
import toast from "react-hot-toast"
const Dashboard = () => {
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate("/");

  const handleLogOut = () => {
    toast.success("Successfully logged out!");
    logout();
    navigate("/");
  };

  return (
    <>
    <button onClick= {handleLogOut} className='mt-80 border text-red cursor-pointer'>
      LogOut
    </button>
    </>
  )
}

export default Dashboard
