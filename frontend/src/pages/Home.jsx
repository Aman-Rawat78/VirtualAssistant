import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext';

const Home = () => {
  const {userData} = useContext(userDataContext);
  return (
     <div className="w-full min-h-screen bg-linear-to-br from-black to-blue-500 flex items-center justify-start flex-col gap-10 py-10">
       <div
     className={`w-75 h-75 bg-[#030326] border-2 border-[#0000ff0e] rounded-2xl
     overflow-hidden hover:shadow-2xl hover:shadow-blue-500 transition-shadow duration-300 `}>
          <img src={userData?.assistantImage} alt="Assistant" className="w-full h-full object-cover" />
      </div>
      </div>
  )
}

export default Home