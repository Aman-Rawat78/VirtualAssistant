import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
export const userDataContext = React.createContext()

const UserContext = ({children}) => {
    const serverUrl = "http://localhost:3000"
    const [userData, setUserData] = useState(null)

    const handleCurrentUserData = async () => {
        try {
          console.log(new Date().toLocaleTimeString()); //print minutes with seconds
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
        setUserData,
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

export default UserContext