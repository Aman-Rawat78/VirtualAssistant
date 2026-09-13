import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
export const userDataContext = createContext()

const UserProvider = ({ children }) => {
  const serverUrl = "http://localhost:3000"
  const [userData, setUserData] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleCurrentUserData = async () => {
    setAuthLoading(true)
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
      setUserData(result.data)
      return result.data
    } catch (error) {
      setUserData(null)
      console.error('Error fetching user data:', error)
      return null
    } finally {
      setAuthLoading(false)
    }
  }

  const getGeminiResponse = async (command) => {
    try{
      const result = await axios.post(`${serverUrl}/api/user/AskAssistant`,{ command}, { withCredentials: true })
      return result.data
    }catch (error) {
      console.error('Error fetching Gemini response:', error)
      return null
    }
  }

  useEffect(() => {
    handleCurrentUserData()
  }, [])
  console.log("userDataContext:", userData)

  const value = {
    serverUrl,
    userData,
    setUserData,
    authLoading,
    handleCurrentUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserProvider