import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext';

const Customize2 = () => {
    const { userData } = useContext(userDataContext);
    const [AssistantName, setAssistantName] = useState(userData?.AssistantName || "");
    console.log(AssistantName);
    return (
        <div className="w-full min-h-screen bg-linear-to-br from-black to-blue-500 flex items-center justify-start flex-col gap-10 py-10">
            <h1 className="text-3xl font-bold text-white">Enter Your <span className="text-blue-500">Assistant Name</span></h1>
            < input onChange={(e) => setAssistantName(e.target.value)} value={AssistantName} type="text" placeholder='Assistant Name' className='w-[300px] p-3 rounded-2xl bg-[#ffffff0e] text-white focus:outline-none focus:ring-2 focus:ring-white-500' />

            {
                AssistantName && <button className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Finally Create Assistant
                </button>
            }

        </div>
    )
}

export default Customize2