import { FcGoogle } from "react-icons/fc";
export default function DashboardPage() {
  return (
    <div className="login">
      <main>
        <h1 className="heading">Login page</h1>
        <div>
          <label>Gender : </label>
          <select name="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of birth : </label>
          <input type="date" name="dateofbirth" />
        </div>
        <div>
          <p>Already Signed In Once</p>
          <button>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
}
