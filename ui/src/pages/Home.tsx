import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.reducer.user);

  useEffect(() => {
    if (user && user.isVerified) {
      navigate("/home");
    }
  }, [user]);

  return (
    <>
      <div className="max-w-sm rounded-xl shadow-lg flex flex-col justify-center mt-14 px-4 py-8 mx-auto">
        <h1 className="text-4xl">Welcome</h1>

        <div className="w-full flex items-center justify-between text-lg mt-6">
          <p>Already have an account?</p>
          <button className="btn" onClick={() => navigate("/auth/login")}>
            Login
          </button>
        </div>

        <div className="w-full flex items-center justify-between text-lg mt-6">
          <p>New here?</p>
          <button className="btn" onClick={() => navigate("/auth/register")}>
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
