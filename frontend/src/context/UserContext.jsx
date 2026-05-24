import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
export const userDataContext = React.createContext()
const userContext = ({children}) => {
    const serverUrl = "http://localhost:3000"
    const [userData, setUserData] = useState(null)

    const handleCurrentUserData = async (data) => {
        try {
          const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true});

          setUserData(result.data);
          console.log(result.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
    }
    useEffect(() => {
        handleCurrentUserData();
      }, []);

    const value = {
        serverUrl,
        userData,
        handleCurrentUserData
    }
  return (
    <div>
       <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider> 
        </div>
  )
}

export default userContext