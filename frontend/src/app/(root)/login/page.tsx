import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
export default function DashboardPage() {
  const [gender, setGender] = useState("male");
  const [date, setDate] = useState("");
  const loginHandeler =  async() => {
    try{

    }catch(error){
      toast.error("Sign In Fail");
    }
  };
  return (
    <div className="login">
      <main>
        <h1 className="heading">Login page</h1>
        <div>
          <label>Gender : </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} name="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of birth : </label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
