import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    const [AssistantName, setAssistantName] = useState(userData?.assistantName || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleUpdateAssistant = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("AssistantName", AssistantName);
            if (backendImage) {
                formData.append("AssistantImage", backendImage);
            } else {
                formData.append("ImgUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
            console.log(result.data);
            setUserData(result.data);
            navigate("/");
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-linear-to-br from-black to-blue-500 flex items-center justify-start flex-col gap-10 py-10">
            <MdOutlineKeyboardBackspace onClick={() => navigate("/customize")} className='absolute top-6 left-15 text-white text-2xl cursor-pointer' />

            <h1 className="text-3xl font-bold text-white">Enter Your <span className="text-blue-500">Assistant Name</span></h1>
            < input onChange={(e) => setAssistantName(e.target.value)} value={AssistantName} type="text" placeholder='Assistant Name' className='w-75 p-3 rounded-2xl bg-[#ffffff0e] text-white focus:outline-none focus:ring-2 focus:ring-white-500' />
            {
                AssistantName && <button onClick={handleUpdateAssistant} disabled={loading} className=" cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {loading ? "Creating..." : "Finally Create Assistant"}
                </button>
            }
        </div>
    )
}

export default Customize2 