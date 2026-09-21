import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import inputvoice from "../assets/inputvoice.gif";
import outputvoice from "../assets/outputvoice.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recoginitionRef = useRef(null);
  const isMountedRef = useRef(false);
  const [uservoice, setuservoice] = useState(true);
  const [userText, setUserText] = useState("");
  const synth = window.speechSynthesis;

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Add logout logic here
    try {
      const response = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true, // Include cookies in the request
      });
      setUserData(null); // Clear user data on logout
      navigate("/signin"); // Redirect to the sign-in page after logout
    } catch (error) {
      setUserData(null); // Clear user data on logout even if there's an error
      navigate("/signin"); // Redirect to the sign-in page after logout
      console.log(error.response?.data?.message || error.message);
    }
  };

  // this function is used to handle the command which required mantual code write like open youtube, open google, open facebook, open twitter, open instagram, open linkedin, open github
  const handleCommand = async (data) => {
    try {
      if (!data) {
        console.error("Assistant returned no response");
        return;
      }
      const { type, userInput, response } = data;
      speak(response);
      //lets use switch case to handle the command
      const query = encodeURIComponent(userInput);
      switch (type) {
        case "google_search":
          window.open(`https://www.google.com/search?q=${query}`, "_blank");
          break;
        case "calculator_open":
          window.open(`https://www.google.com/search?q=calculator`, "_blank");
          break;
        case "youtube_search":
          window.open(
            `https://www.youtube.com/results?search_query=${query}`,
            "_blank",
          );
          break;
        case "youtube_open":
          window.open(`https://www.youtube.com`, "_blank");
          break;
        case "instagram_open":
          window.open(`https://www.instagram.com/`, "_blank");
          break;
        case "weather_show":
          window.open(
            `https://www.google.com/search?q=weather+${query}`,
            "_blank",
          );
          break;  
        case "facebook_open":
          window.open(`https://www.facebook.com/`, "_blank");
          break;
        
      }
    } catch (error) {
      console.error("Error handling command:", error);
    }
  };

  const startRecognition = () => {
    if (
      !isMountedRef.current ||
      isSpeakingRef.current ||
      isRecognizingRef.current
    ) {
      return;
    }

    try {
      isRecognizingRef.current = true;
      recoginitionRef.current?.start();
      setListening(true);
    } catch (error) {
      isRecognizingRef.current = false;
      if (!error.message.includes("start")) {
        console.error("Recognition error:", error);
      }
    }
  };

  // Text to speech function
  const speak = (text) => {
    setuservoice(false);
    const voices = synth.getVoices();

    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    const hindiVoice = voices.find((voice) => voice.lang === "hi-IN");
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }
    utterence.onend = () => {
      setUserText("");
      isSpeakingRef.current = false;
      startRecognition(); // Restart recognition after speaking
    };

    synth.speak(utterence);
    setuservoice(true);
  };

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }
    isMountedRef.current = true;
    // Initialize the speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until stopped
    recognition.lang = "en-US";

    // Store the recognition instance in a ref to access it later
    recoginitionRef.current = recognition;

    let restartTimer;
    let isActive = true;

    // Function to safely start recognition
    const safeRecognition = () => {
      if (!isActive || isSpeakingRef.current || isRecognizingRef.current) {
        return;
      }

      try {
        isRecognizingRef.current = true;
        recognition.start();
        console.log("Recognition requested to start");
      } catch (error) {
        isRecognizingRef.current = false;
        if (error.name !== "InvalidStateError") {
          console.error("Error starting recognition:", error);
        }
      }
    };

    const scheduleRecognition = () => {
      if (
        !isActive ||
        isSpeakingRef.current ||
        isRecognizingRef.current ||
        restartTimer
      ) {
        return;
      }

      restartTimer = setTimeout(() => {
        restartTimer = null;
        safeRecognition();
      }, 3000);
    };

    // This is triggered after start() is called successfully.
    recognition.onstart = () => {
      if (!isActive) return;
      isRecognizingRef.current = true;
      console.log("Recognition started");
      setListening(true);
    };

    // This is triggered when the recognition ends. to restart immediately after it ends, we can call start() again in the onend event handler.
    recognition.onend = () => {
      if (!isActive) return;
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
      scheduleRecognition();
    };

    // This is triggered when an error occurs during recognition.Examples:microphone blocked,no speech detected,network issue, browser rejects access
    recognition.onerror = (event) => {
      if (isActive && event.error !== "aborted") {
        console.error("Recognition error:", event.error);
      }
    };

    recognition.onresult = async (event) => {
      if (!isActive) return;
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log(transcript);
      if (
        transcript.toLowerCase().includes(userData?.assistantName.toLowerCase())
      ) {
        isSpeakingRef.current = true; // Set speaking state to true to prevent recognition from restarting
        recognition.stop(); // Stop recognition to process the command
        isRecognizingRef.current = false;
        setListening(false);
        setuservoice(false);
        setUserText(transcript);

        // Do something when the assistant's name is recognized
        const data = await getGeminiResponse(transcript);
        console.log("Gemini Response:", data);
        handleCommand(data);
        setUserText(data?.response || "Sorry, I didn't understand that.");
      }
    };
    safeRecognition();

    return () => {
      isActive = false;
      isMountedRef.current = false;
      clearTimeout(restartTimer);
      synth.cancel();
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      recognition.stop();
      recoginitionRef.current = null;
      isSpeakingRef.current = false;
      isRecognizingRef.current = false;
      setListening(false);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-black to-blue-500 flex items-center justify-start flex-col gap-10 py-10">
      <IoMenu className="lg:hidden text-white absolute top-5 left-3 text-4xl" onClick={() => setMenuOpen(true)} />
      <div className={`lg:hidden absolute top-0 w-full h-full bg-[#0000000e] backdrop-blur-lg ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 `}>
        <RxCross2 className="text-white right-4 top-4 absolute text-4xl" onClick={() => setMenuOpen(false)} />

        <div className="flex flex-col h-full items-center justify-center gap-4">
          <button
            onClick={handleLogout}
            className="  p-2 cursor-pointer bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log Out
          </button>
          <button
            onClick={() => navigate("/customize")}
            className="  p-2 cursor-pointer bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Customize Your Assistant
          </button>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="hidden lg:block absolute top-4 right-4 p-2 cursor-pointer bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Log Out
      </button>
      <button
        onClick={() => navigate("/customize")}
        className="hidden lg:block absolute top-15 right-4 p-2 cursor-pointer bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Customize Your Assistant
      </button>
      <div
        className={`w-75 h-75 bg-[#030326] border-2 border-[#0000ff0e] rounded-2xl
     overflow-hidden hover:shadow-2xl hover:shadow-blue-500 transition-shadow duration-300 `}
      >
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-2xl font-bold text-white">
        I'm {userData?.assistantName}
      </h1>
      {uservoice ? (
        <img src={inputvoice} alt="Output Voice" className="w-40 h-30" />
      ) : (
        <img src={outputvoice} alt="Input Voice" className="w-40 h-30" />
      )}
      <h1 className="text-white text-lg font-semibold">{userText}</h1>
    </div>
  );
};

export default Home;
