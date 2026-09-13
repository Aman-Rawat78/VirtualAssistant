import { useContext, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext.jsx'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

function App() {
  const { userData, authLoading } = useContext(userDataContext)

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={(userData?.assistantImage && userData?.assistantName) ? <Home /> : <Navigate to="/customize" />} />
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path='/customize' element={userData ? <Customize /> : <Navigate to="/signin" />} />
      <Route path='/customize2' element={userData ? <Customize2 /> : <Navigate to="/signin" />} />
    </Routes>
  )
}

export default App
