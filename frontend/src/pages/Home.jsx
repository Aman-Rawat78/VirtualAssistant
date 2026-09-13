import React, { useContext, useEffect } from 'react'
import { userDataContext } from "../context/UserContext.jsx"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Add logout logic here
    try{
      const response = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true, // Include cookies in the request
      });
      setUserData(null); // Clear user data on logout
      navigate('/signin'); // Redirect to the sign-in page after logout
    }catch(error){
      setUserData(null); // Clear user data on logout even if there's an error
      navigate('/signin'); // Redirect to the sign-in page after logout 
      console.log(error.response?.data?.message || error.message);
    }
  };


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.lang = 'en-US'; 

    recognition.onresult = async(event) => {
      console.log(event.results[event.results.length - 1][0].transcript)
    const transcript = event.results[event.results.length - 1][0].transcript;
    if(transcript.toLowerCase().includes(userData?.assistantName.toLowerCase())){ 
       // Do something when the assistant's name is recognized
     const data = await getGeminiResponse(transcript)
      console.log("Gemini Response:", data);
     };
    }

     

    recognition.start();

    
  }, []);

  return (
     <div className="w-full min-h-screen bg-linear-to-br from-black to-blue-500 flex items-center justify-start flex-col gap-10 py-10">
        <button  onClick={handleLogout} className='absolute top-4 right-4 p-2 cursor-pointer bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500' >
         Log Out
        </button>
        <button  onClick={()=> navigate('/customize')} className='absolute top-15 right-4 p-2 cursor-pointer bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500' >
         Customize Your Assistant
        </button>
       <div
     className={`w-75 h-75 bg-[#030326] border-2 border-[#0000ff0e] rounded-2xl
     overflow-hidden hover:shadow-2xl hover:shadow-blue-500 transition-shadow duration-300 `}>
          <img src={userData?.assistantImage} alt="Assistant" className="w-full h-full object-cover" />
      </div>
      <h1 className="text-2xl font-bold text-white">I'm {userData?.assistantName}</h1>
      </div>
  )
}

export default Home