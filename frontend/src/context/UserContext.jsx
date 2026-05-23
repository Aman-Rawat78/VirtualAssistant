import React from 'react'
export const userDataContext = React.createContext()
const userContext = ({children}) => {
    const serverUrl = "http://localhost:3000"
    const value = {
        serverUrl
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