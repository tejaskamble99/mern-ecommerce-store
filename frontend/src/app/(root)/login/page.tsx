"use client";
import { auth } from "@/firebase";
import { getUser, useLoginMutation } from "@/redux/api/userApi";
import { MessageResponse } from "@/types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function LogInPage() {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [login] = useLoginMutation();
  const router = useRouter();

  // FIX 1: renamed to `currentUser` to avoid shadowing Firebase `user` inside handler
  const { user: currentUser } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    if (currentUser?._id) {
      router.push("/");
    }
  }, [currentUser, router]);

  const loginHandler = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();

      // FIX 1: renamed to `firebaseUser` — no longer shadows Redux `currentUser`
      const { user: firebaseUser } = await signInWithPopup(auth, provider);

      try {
        // axios throws on 404, so this catch correctly identifies new users
        await getUser(firebaseUser.uid);

        // Returning user — log them in directly
        toast.success(`Welcome back, ${firebaseUser.displayName ?? "there"}!`);
        router.push("/");

      } catch {
        // New user (getUser threw 404)
        setIsNewUser(true);

        if (!gender || !date) {
          toast.error("Please fill Gender and Date of Birth to register");
          await signOut(auth);
          return;
        }

        // New user + fields filled — register them
        const res = await login({
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "no-email@example.com", 
          // Use a real URL so the backend doesn't reject it as empty!
          photo: firebaseUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
          gender,
          role: "user",
          dob: date,
          _id: firebaseUser.uid,
          
        });

        if ("data" in res) {
          toast.success("Registration Successful!");
          router.push("/");
        } else {
          // FIX 3: safer error shape extraction
          const apiError = res.error as FetchBaseQueryError;
          const message =
            apiError?.data &&
            typeof apiError.data === "object" &&
            "message" in apiError.data
              ? (apiError.data as MessageResponse).message
              : "Something went wrong. Please try again.";
          toast.error(message);
          await signOut(auth);
        }
      }
    } catch (error) {
      // FIX 4: distinguish cancelled popup from real failures
      if (error instanceof Error && error.message.includes("popup-closed-by-user")) {
        toast.error("Sign-in cancelled.");
      } else {
        toast.error("Google Sign-In Failed. Please try again.");
      }
    } finally {
      // FIX 5: always reset loading, even if an early `return` was hit
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login Page</h1>

        {/* FIX 6: context message so returning users aren't confused */}
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
          {/* FIX 7: disabled + loading indicator to prevent double-clicks */}
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