import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
export const userDataContext = React.createContext()

const UserContext = ({children}) => {
    const serverUrl = "http://localhost:3000"
    const [userData, setUserData] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
      const [frontendImage, setFrontendImage] = useState(null);
      const [backendImage, setBackendImage] = useState(null);
      const [selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUserData = async () => {
        setAuthLoading(true)
        try {
          const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true});
         
          setUserData(result.data);
          console.log(result.data);
        } catch (error) {
          setUserData(null)
          console.error('Error fetching user data:', error);
        } finally {
          setAuthLoading(false)
        }
    }
    useEffect(() => {
        handleCurrentUserData();
      }, []);

    const value = {
        serverUrl,
        userData,
        setUserData,
        authLoading,
        handleCurrentUserData,
        frontendImage, setFrontendImage,
        backendImage, setBackendImage,
        selectedImage, setSelectedImage
    }
  return (
    <div>
       <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider> 
        </div>
  )
}

export default UserContext