import React, { useState } from 'react'
import bg from "../assets/robot1.png"
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [showPassword, setshowPassword] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Perform form validation and submission logic here
    // You can access the form data using the state variables (name, email, password)
  }
  return (
    <div className='w-full h-screen bg-cover flex justify-center items-center' style={{ backgroundImage : `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <form className='w-150 h-150 max-w-125 bg-[#0000000e] backdrop-blur shadow-lg shadow-blue-950 flex flex-col justify-center items-center gap-5 rounded-lg p-10'>
           <h1 className='text-white text-[30px] font-semibold mb-10px'>
            Sign In to <span className='text-blue-500'>Virtual Assistant</span>
           </h1>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' className='w-full p-3 rounded-2xl bg-[#ffffff0e] text-white focus:outline-none focus:ring-2 focus:ring-white-500' />
           
           <div className='relative w-full h-60px border-2 border-white bg-transparent text-white rounded-2xl text-18px'>
             <input onChange={(e)=>setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder='Password' className='w-full p-3 rounded-2xl bg-[#ffffff0e] text-white focus:outline-none focus:ring-2 focus:ring-white-500' />
            <LuEye onClick={(e)=>setshowPassword(!showPassword)} className='absolute right-3 top-4 text-white'/>
           </div>

            <button onClick={handleSubmit} className='w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              Sign In
            </button>

            <p className='text-white'>Already have an account?<span className='text-blue-950 font-bold cursor-pointer' onClick={() => navigate('/signup')}>SignUp</span></p>
        </form>
    </div>
  )
}

export default SignIn