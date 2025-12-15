import axios from "axios";
import React, { useEffect } from "react";

function ProtectedRouters({ children }) {

    useEffect(() => {
        checkForlogin()
    }, [])


    async function checkForlogin() {
        const response = await axios.get(
            "http://localhost:3000/check/login?referer=admin",
            { withCredentials: true })

        console.log(response)
    }


    return children;
}

export default ProtectedRouters;