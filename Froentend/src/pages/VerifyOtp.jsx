import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../axios.Config";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const { state } = useLocation();

    const email = state?.email;

    async function handleVerify(e) {
        e.preventDefault();

        try {
            await instance.post("/api/auth/verify-login-otp", {
                email,
                otp,
            });

            toast.success("OTP verified successfully");
            navigate("/");

        } catch (error) {
            toast.error(error.response?.data?.message || "OTP failed");
        }
    }


    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <ToastContainer position="top-right" autoClose={3000} />

            <form onSubmit={handleVerify} className="bg-white p-6 rounded-xl shadow w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>

                <input
                    type="text"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border p-2 rounded mb-4 text-center"
                    placeholder="Enter OTP"
                    required
                />

                <button className="w-full bg-blue-600 text-white py-2 rounded">
                    Verify OTP
                </button>
            </form>
        </div>
    );


}

export default VerifyOtp;
