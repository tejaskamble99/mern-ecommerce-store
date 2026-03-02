"use client";
import { auth } from "@/firebase";
import { useLoginMutation } from "@/redux/api/userApi";
import { MessageResponse } from "@/types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
export default function DashboardPage() {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const loginHandeler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
       

      
      const res =await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role : "user",
        dob : date,
        userId : user.uid,
      });

      if("data" in res){
        toast.success("Sign In Success");
      }else{
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
      }
      
    } catch (error) {
      toast.error("Sign In Fail");
    }
  };
  return (
    <div className="login">
      <main>
        <h1 className="heading">Login page</h1>
        <div>
          <label>Gender : </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            name="gender"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of birth : </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandeler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
}
