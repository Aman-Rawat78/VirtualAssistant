import React, { useContext, useState } from 'react'
import bg from "../assets/robot1.png"
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

const SignUp = () => {
  const [showPassword, setshowPassword] = useState(false)
   const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { serverUrl } = useContext(userDataContext)

  const handleSignup = async (e) => {
    e.preventDefault();  
     try {
      if(!name || !email || !password) {
        alert("Please fill all the fields")
        return;
      }
      
   const input = {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
   }
      const result = await axios.post(`${serverUrl}/api/auth/signup`, input,{withCredentials : true});
      console.log(result)
      console.log(result.data)
      setEmail("")
      setPassword("")
     } catch (error) {
      console.error("Error occurred while signing up:", error);
     }
  }
  return (
    <div className='w-full h-screen bg-cover flex justify-center items-center' style={{ backgroundImage : `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <form onSubmit={(e) => {handleSignup(e); }} className='w-150 h-150 max-w-125 bg-[#0000000e] backdrop-blur shadow-lg shadow-blue-950 flex flex-col justify-center items-center gap-5 rounded-lg p-10'>
           <h1 className='text-white text-[30px] font-semibold mb-10px'>
            Register to <span className='text-blue-500'>Virtual Assistant</span>
           </h1>
            <input onChange={(e)=> setName(e.target.value)} type="text" placeholder='Name' className='w-full p-3 rounded-2xl bg-[#ffffff0e] text-white focus:outline-none focus:ring-2 focus:ring-white-500' />
            <input onChange={(e)=> setEmail(e.target.value)} type="email" placeholder='Email' className='w-full p-3 rounded-2xl bg-[#ffffff0e] text-white focus:outline-none focus:ring-2 focus:ring-white-500' />
           
           <div className='relative w-full h-60px border-2 border-white bg-transparent text-white rounded-2xl text-18px'>
             <input onChange={(e)=> setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder='Password' className='w-full p-3 rounded-2xl bg-[#ffffff0e] text-white focus:outline-none focus:ring-2 focus:ring-white-500' />
            <LuEye onClick={()=>setshowPassword(!showPassword)} className='absolute right-3 top-4 text-white'/>
           </div>

            <button type='submit' className='w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              Sign Up
            </button>

            <p className='text-white'>Already have an account?<span className='text-blue-950 font-bold cursor-pointer' onClick={() => navigate('/signin')}>SignIn</span></p>
        </form>
    </div>
  )
}

export default SignUp