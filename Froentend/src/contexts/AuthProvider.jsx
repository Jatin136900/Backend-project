import { createContext, useContext, useState } from "react";

const authContext = createContext();

function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loggedinUser, setLoggedinUser] = useState(null)


    return (
        <authContext.Provider value={{ isLoggedIn, loggedinUser }}>
            {children}
        </authContext.Provider>
    )
}

export function useAuth() {
    return useContext(authContext)
}

export default AuthProvider