import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Title from "../../components/ui/Title";
import { toast } from "react-toastify";
import OtpInput from "../../components/form/OtpInput";
import Link from "next/link";

const Verify = () => {
  const { query, push } = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    // Auto-send OTP when page loads
    send();
  }, []);

  const send = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      await axios.post(`/api/otp/send`, {
        phoneNumber: query.phone
      });
      toast.success("OTP sent to your WhatsApp");
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (verifyLoading || code.length !== 6) return;
    
    try {
      setVerifyLoading(true);
      
      // First verify the OTP
      console.log('Verifying OTP for phone:', query.phone);
      const verifyResponse = await axios.post(`/api/otp/verify`, {
        phoneNumber: query.phone,
        code,
      });
      console.log('OTP verification response:', verifyResponse.status);

      // Get registration data
      const pending = localStorage.getItem("pendingRegistration");
      if (!pending) {
        console.log('No pending registration found');
        toast.success("Phone verified!");
        push("/auth/login");
        return;
      }
      console.log('Found pending registration data');

      // Complete registration
      const data = JSON.parse(pending);
      localStorage.removeItem("pendingRegistration");
      
      try {
        // Make sure we're sending all required fields
        const registrationData = {
          fullName: data.fullName,
          phoneNumber: query.phone, // Use the phone number from the URL
          password: data.password,
          confirmPassword: data.password,
          phoneVerified: true
        };

        const registerResponse = await axios.post(`/api/users/register`, registrationData);
        
        if (registerResponse.status === 200) {
          toast.success("Registration completed successfully! Please login.");
          push("/auth/login");
        } else {
          throw new Error("Registration failed. Please try again.");
        }
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message || "Registration failed. Please try again.");
        }
        console.error("Registration error details:", error);
      }
    } catch (err) {
      toast.error("Invalid code");
      setCode(""); // Clear invalid code
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center my-20 md:w-1/2 w-full mx-auto">
        <Title addClass="text-[32px] mb-6">Enter OTP Code</Title>
        <div className="w-full max-w-md flex flex-col items-center gap-y-8">
          {/* OTP Input */}
          <div className="w-full flex flex-col items-center gap-6">
            <OtpInput 
              value={code} 
              onChange={setCode}
            />
            <button 
              className={`btn-primary w-64 py-4 text-lg font-semibold rounded-xl
                        ${verifyLoading ? 'opacity-75' : ''}`} 
              onClick={verify} 
              disabled={code.length !== 6 || verifyLoading}
            >
              {verifyLoading ? "Verifying..." : "Submit"}
            </button>
          </div>

          {/* Resend Link */}
          <div className="flex items-center gap-x-2">
            <span className="text-gray-500">Still not get the OTP?</span>
            <button
              onClick={send}
              disabled={loading}
              className="text-primary hover:text-primary-dark font-semibold"
            >
              {loading ? "Sending..." : "Send Again"}
            </button>
          </div>

          {/* Back Link */}
          <Link href="/auth/register">
            <a className="text-gray-500 hover:text-gray-700">
              ← Back to Register
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
