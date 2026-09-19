import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from "../context/UserContext.jsx"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const {userData,serverUrl,setUserData,getGeminiResponse} = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recoginitionRef = useRef(null);
  const synth = window.speechSynthesis;


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

  
  // this function is used to handle the command which required mantual code write like open youtube, open google, open facebook, open twitter, open instagram, open linkedin, open github
  const handleCommand = async (data) => {
    try{
     if (!data) {
       console.error("Assistant returned no response");
       return;
     }
     const {type, userInput, response} = data;
     speak(response);
     //lets use switch case to handle the command
       const query = encodeURIComponent(userInput);
     switch(type) {
       case "google_search":
         window.open(`https://www.google.com/search?q=${query}`, '_blank');
         break;
       case "calculator_open":
         window.open(`https://www.google.com/search?q=calculator`, '_blank');
         break;
       case "youtube_search":
          window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
         break;
       case "youtube_open":    
         window.open(`https://www.youtube.com`, '_blank');
         break;
       case "instagram_open":
         window.open(`https://www.instagram.com/`, '_blank');
         break;
     }
     
    }catch(error){
      console.error("Error handling command:", error);
    }
  }


  const startRecognition = () => {
    if (isSpeakingRef.current || isRecognizingRef.current) {
      return;
    }

    try {
      isRecognizingRef.current = true;
      recoginitionRef.current?.start();
      setListening(true);
    } catch (error) {
      isRecognizingRef.current = false;
      if(!error.message.includes("start")){
        console.error("Recognition error:", error)
      }
    }
  }

  // Text to speech function
  const speak = (text) => {
  const trySpeak = () => {
    const voices = synth.getVoices();
   
    if (voices.length === 0) {
      setTimeout(trySpeak, 100);
      return;
    }

    const ziraVoice = voices.find(
      (voice) =>
        voice.name === "Microsoft Zira - English (United States)"
    );

    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "en-US";

    if (ziraVoice) {
      utterence.voice = ziraVoice;
    }
   utterence.onend = () => {
      isSpeakingRef.current = false;
      startRecognition(); // Restart recognition after speaking
    };

    synth.speak(utterence);
  };

  trySpeak();
};



  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    // Initialize the speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.lang = 'en-US'; 

    // Store the recognition instance in a ref to access it later
    recoginitionRef.current = recognition;

    let restartTimer;
   

    // Function to safely start recognition
    const safeRecognition = () => {
      if (isSpeakingRef.current || isRecognizingRef.current) {
        return;
      }

      try {
        isRecognizingRef.current = true;
        recognition.start();
        console.log("Recognition requested to start");
      } catch (error) {
        isRecognizingRef.current = false;
        if(error.name !== 'InvalidStateError'){
          console.error("Error starting recognition:", error);
        }
      }
    }
    
    
    // This is triggered after start() is called successfully.
    recognition.onstart = () => {
      isRecognizingRef.current = true;
      console.log("Recognition started");
      setListening(true);
    };

    // This is triggered when the recognition ends. to restart immediately after it ends, we can call start() again in the onend event handler.
    recognition.onend = () => {
       console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
      // Restart recognition after a short delay
      if(!isSpeakingRef.current){
        restartTimer = setTimeout(safeRecognition, 3000);
      }
    };

    // This is triggered when an error occurs during recognition.Examples:microphone blocked,no speech detected,network issue, browser rejects access
    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      // if(event.error === 'aborted' || !isSpeakingRef.current){
      //   setTimeout(safeRecognition, 1000);
      // }
    };

    recognition.onresult = async(event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log(transcript);
    if(transcript.toLowerCase().includes(userData?.assistantName.toLowerCase())){ 
      isSpeakingRef.current = true; // Set speaking state to true to prevent recognition from restarting
      recognition.stop(); // Stop recognition to process the command
      console.log("1");
      isRecognizingRef.current = false;
      setListening(false);
 
       // Do something when the assistant's name is recognized
     const data = await getGeminiResponse(transcript)
      console.log("Gemini Response:", data);
      handleCommand(data);
     };
    }
  safeRecognition();
    const fallback = setInterval(() => {
      if(!isRecognizingRef.current && !isSpeakingRef.current){
        safeRecognition();
      }
    }, 10000);
    
    return () => {
      clearInterval(fallback);
      clearTimeout(restartTimer);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
    }
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