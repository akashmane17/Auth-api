import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { object, string, TypeOf } from "zod";
import { setCredentials } from "../store/slices/authSlice";

// schema to validate user inputs
const createUserSchema = object({
  firstName: string().min(1, {
    message: "First Name is required",
  }),
  lastName: string().min(1, {
    message: "Last Name is required",
  }),
  email: string({
    required_error: "Email is required",
  }).email("Not a valid email"),
  password: string().min(6, "Password should be 6 characters minimum"),
  passwordConfirmation: string().min(1, {
    message: "Please confirm your password",
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

// create type to pass in useForm
type CreateUserInput = TypeOf<typeof createUserSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");
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
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (values: CreateUserInput) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/users`, values);
      dispatch(setCredentials(res.data));
      navigate(`/auth/verify/${res.data.userId}`);
    } catch (e: any) {
      console.log(e);
      setRegisterError(e.message);
    }
  };

  return (
    <div className="bg-slate-50 max-w-sm rounded-xl shadow-lg flex flex-col justify-center mt-14 px-4 py-8 mx-auto">
      <h1 className="text-4xl">Register</h1>
      <p className="text-sm text-red-500">{registerError}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-box">
        <div className="form-element">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="jane"
            {...register("firstName")}
          />
          <p className="text-sm text-red-500">{`${
            errors?.firstName?.message ? errors?.firstName?.message : ""
          }`}</p>
        </div>

        <div className="form-element">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder="doe"
            {...register("lastName")}
          />
          <p className="text-sm text-red-500">{`${
            errors?.lastName?.message ? errors?.lastName?.message : ""
          }`}</p>
        </div>

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

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirmation"
            placeholder="confirm password"
            {...register("passwordConfirmation")}
          />
          <p className="text-sm text-red-500">{`${
            errors?.passwordConfirmation?.message
              ? errors?.passwordConfirmation?.message
              : ""
          }`}</p>
        </div>

        <button className="btn" type="submit">
          Register
        </button>
      </form>

      <p className="mt-4 text-md">
        Already have an account?{" "}
        <Link to={`/auth/login`} className="text-blue-500 hover:underline">
          Login Now
        </Link>
      </p>
    </div>
  );
};

export default Register;
