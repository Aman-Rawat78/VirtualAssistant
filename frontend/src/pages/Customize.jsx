import React, { useContext, useRef, useState } from 'react'
import { RiImageAddLine } from "react-icons/ri";
import Card from '../components/Card'
import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
import img4 from '../assets/img4.png'
import img5 from '../assets/img5.png'
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Customize = () => {
  const { serverUrl, userData, setUserData, handleCurrentUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage } = useContext(userDataContext);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFrontendImage(URL.createObjectURL(file));
    setBackendImage(file);
    console.log(backendImage);
    console.log(frontendImage);

  }
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-black to-blue-500 flex items-center justify-start flex-col gap-10 py-10">
      <h1 className="text-3xl font-bold text-white">Select your Assistant Image</h1>
    
      {
        selectedImage &&
        <button onClick={() => navigate('/customize2')} className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Next
        </button>
      }
      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-16">
        <Card image={img1} />
        <Card image={img2} />
        <Card image={img3} />
        <Card image={img4} />
        <Card image={img5} />



        <div onClick={() => { inputRef.current?.click(); setSelectedImage("input") }}
          className={`${selectedImage === "input" ? 'border-white' : ''} w-50 h-75 flex justify-center items-center bg-[#37376435] border-2 border-[#0000ff0e] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500 transition-shadow duration-300`}>
          {
            frontendImage ? <img src={frontendImage} alt="Selected" className='h-full object-cover' /> : <RiImageAddLine className="text-white mx-auto my-auto" size={40} />
          }


        </div>
        <input type="file" accept="image/*" hidden onChange={handleImageChange} ref={inputRef} />
      </div>


    </div>
  )
}

export default Customize