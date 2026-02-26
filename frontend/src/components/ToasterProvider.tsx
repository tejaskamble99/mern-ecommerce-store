"use client"; 
import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return (
    <Toaster 
      position="bottom-center" 
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          fontSize: '1rem',
        },
      }} 
    />
  );
};