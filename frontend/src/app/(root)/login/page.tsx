"use client";
import { auth } from "@/firebase";
import { getUser, useLoginMutation } from "@/redux/api/userApi";
import { userExist } from "@/redux/reducer/userReducer";
import { MessageResponse } from "@/types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function LogInPage() {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const { user: currentUser } = useSelector(
    (state: RootState) => state.userReducer
  );

  useEffect(() => {
    if (currentUser?._id) router.push("/");
  }, [currentUser, router]);

  const loginHandler = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);

      try {
        
        const userData = await getUser(firebaseUser.uid);

       
        dispatch(userExist(userData.user));
        toast.success(`Welcome back, ${firebaseUser.displayName ?? "there"}!`);
        router.push("/");
      } catch {
        
        setIsNewUser(true);

        if (!gender || !date) {
          toast.error("Please fill Gender and Date of Birth to register");
         
          try { await signOut(auth); } catch {}
          return;
        }

        const res = await login({
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "no-email@example.com",
          photo:
            firebaseUser.photoURL ||
            "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
          gender,
          role: "user",
          dob: date,
          _id: firebaseUser.uid,
        });

        if ("data" in res) {
          toast.success("Registration Successful!");
          router.push("/");
        } else {
          const apiError = res.error as FetchBaseQueryError;
          const message =
            apiError?.data &&
            typeof apiError.data === "object" &&
            "message" in apiError.data
              ? (apiError.data as MessageResponse).message
              : "Something went wrong. Please try again.";
          toast.error(message);
          
          try { await signOut(auth); } catch {}
        }
      }
    } catch (error) {
      
      if (
        error instanceof Error &&
        error.message.includes("popup-closed-by-user")
      ) {
        toast.error("Sign-in cancelled.");
      } else {
        toast.error("Google Sign-In Failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login Page</h1>

        <p className="register-hint">
          {isNewUser
            ? "You're new here! Please fill in the details below to complete registration."
            : "First time registering? Fill the fields before signing in. Returning users can leave them empty."}
        </p>

        <div>
          <label>Gender : </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            name="gender"
            disabled={loading}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of Birth : </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <button onClick={loginHandler} disabled={loading}>
            {loading ? (
              <span>Please wait...</span>
            ) : (
              <>
                <FcGoogle />
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}