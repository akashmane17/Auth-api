import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { object, string, TypeOf } from "zod";
import { setCredentials } from "../store/slices/authSlice";

// schema to validate user inputs
const loginUserSchema = object({
  email: string({
    required_error: "Email is required",
  }).email("Not a valid email"),
  password: string().min(6, "Password should be 6 characters minimum"),
});

// create type to pass in useForm
type LoginUserInput = TypeOf<typeof loginUserSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.reducer.user);

  useEffect(() => {
    if (user && user.isVerified) {
      navigate("/home");
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (values: LoginUserInput) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/sessions`,
        values,
        { withCredentials: true }
      );
      
      dispatch(setCredentials(res.data));
      navigate(`/home`);
    } catch (e: any) {
      console.log(e);

      setLoginError(e.message);
    }
  };

  return (
    <div className="bg-slate-50 max-w-sm rounded-xl shadow-lg flex flex-col justify-center mt-14 px-4 py-8 mx-auto">
      <h1 className="text-4xl">Login</h1>
      <p className="text-sm text-red-500">{loginError}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-box">
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            {...register("email")}
          />
          <p className="text-sm text-red-500">{`${
            errors?.email?.message ? errors?.email?.message : ""
          }`}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            {...register("password")}
          />
          <p className="text-sm text-red-500">{`${
            errors?.password?.message ? errors?.password?.message : ""
          }`}</p>
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
      
      <p className="mt-4 text-md">
       Don't have an accounte?{" "}
        <Link
          to={`/auth/register`}
          className="text-blue-500 hover:underline"
        >
          Register Now
        </Link>
      </p>
    </div>
  );
};

export default Login;
