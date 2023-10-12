import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutError, setLogoutError] = useState("");

  const user = useSelector((state: any) => {
    return state.reducer.user;
  });

  const logoutHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/sessions`, {
        withCredentials: true,
      });
      dispatch(logout());
      navigate(`/`);
    } catch (e: any) {
      console.log(e);

      setLogoutError(e.message);
    }
  };

  return (
    <>
      <div className="max-w-sm rounded-xl shadow-lg flex flex-col justify-center mt-14 px-4 py-8 mx-auto">
        <h1 className="text-4xl">Welcome {user?.firstName}</h1>

        <p className="text-sm text-red-500">{logoutError}</p>

        <div className="w-full flex items-center justify-between text-lg mt-6">
          <p>View your profile</p>
          <button className="btn" onClick={() => navigate("/profile")}>
            Profile
          </button>
        </div>
        <div className="w-full flex items-center justify-between text-lg mt-6">
          <p>Wanna logout?</p>
          <button className="btn" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
