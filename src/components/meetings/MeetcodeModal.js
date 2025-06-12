// 'use client';
// import { useState, useEffect } from 'react';

// export default function CodeVerificationModal({ isOpen, onClose, verificationUrl }) {
//   const [codeInput, setCodeInput] = useState('');
//   const [isTimerActive, setIsTimerActive] = useState(false);
//   const [secondsLeft, setSecondsLeft] = useState(60);
//   const [hasSentOnce, setHasSentOnce] = useState(false);

//   // Timer countdown logic
//   useEffect(() => {
//     let timer;
//     if (isTimerActive && secondsLeft > 0) {
//       timer = setInterval(() => {
//         setSecondsLeft((prev) => prev - 1);
//       }, 1000);
//     } else if (secondsLeft === 0) {
//       setIsTimerActive(false);
//     }
//     return () => clearInterval(timer);
//   }, [isTimerActive, secondsLeft]);

//   const handleGetCode = () => {
//     if (!verificationUrl) {
//       alert("❌ Verification URL missing.");
//       return;
//     }

//     window.open(verificationUrl, "_blank");
//     setIsTimerActive(true);
//     setSecondsLeft(60);
//     setHasSentOnce(true);
//   };

//   const handleVerifyCode = async () => {
//     if (!codeInput) {
//       alert('❌ Please enter the code.');
//       return;
//     }

//     try {
//   const res = await fetch(`http://localhost:8080/oauth2callback?code=${codeInput}`);
//   const data = await res.json();
//   console.log('✅ Verification successful:', data);
//   setCodeInput('');
//   onClose(); // close modal
// } catch (error) {
//   console.error('❌ Verification failed:', error);
// }

//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-5 shadow-xl relative">
//         <button
//           className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500"
//           onClick={onClose}
//         >
//           &times;
//         </button>

//         <h2 className="text-xl font-semibold text-center">Verify Account</h2>

//         <div className="text-sm text-gray-600 border p-3 rounded-md bg-gray-50">
//           <p>1. Click <strong>Get Code</strong> and complete the OAuth process in the new window.</p>
//           <p>2. Copy the verification code.</p>
//           <p>3. Paste it below and click <strong>Verify</strong>.</p>
//         </div>

//         <button
//           onClick={handleGetCode}
//           disabled={isTimerActive}
//           className={`w-full px-4 py-2 rounded text-white ${isTimerActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//         >
//           {hasSentOnce  ? `Retry in ${secondsLeft}s` : hasSentOnce ? 'Resend Code' : 'Get Code'}
//         </button>

//         <input
//           type="text"
//           placeholder="Paste verification code"
//           className="w-full border p-2 rounded-md outline-green-500"
//           value={codeInput}
//           onChange={(e) => setCodeInput(e.target.value)}
//           disabled={isTimerActive}
//         />

//         <button
//           onClick={handleVerifyCode}
//           className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Verify
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";
import axiosInstance3 from "@/lib/axiosInstance3";
import { useState } from "react";

export default function CodeVerificationModal({
  isOpen,
  onClose,
  verificationUrl,
}) {
  const [codeInput, setCodeInput] = useState("");

  const handleGetCode = () => {
    if (!verificationUrl) {
      alert("❌ Verification URL missing.");
      return;
    }

    window.open(verificationUrl, "_blank");
  };

  const handleVerifyCode = async () => {
    if (!codeInput) {
      alert("❌ Please enter the code.");
      return;
    }

    try {
      const res = await axiosInstance3.get(`/oauth2callback?code=${codeInput}`);
      console.log("✅ Verification successful:", res.data);

      setCodeInput("");
      onClose(); // close modal
    } catch (err) {
      console.error("❌ Verification failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-5 shadow-xl relative">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-center">Verify Account</h2>

        <div className="text-sm text-gray-600 border p-3 rounded-md bg-gray-50">
          <p>
            1. Click <strong>Get Code</strong> and complete the OAuth process in
            the new window.
          </p>
          <p>2. Copy the verification code.</p>
          <p>
            3. Paste it below and click <strong>Verify</strong>.
          </p>
        </div>

        <input
          type="text"
          placeholder="Paste verification code"
          className="w-full border p-2 rounded-md outline-green-500"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
        />
        <div className="flex justify-between items-center mt-4 gap-4">
          <button
            onClick={handleGetCode}
            className="w-full px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Get Code
          </button>

          <button
            onClick={handleVerifyCode}
            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
