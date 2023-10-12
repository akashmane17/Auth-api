import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { object, string, TypeOf } from "zod";

// schema to validate user inputs
const emailSchema = object({
  email: string({
    required_error: "Email is required",
  }).email("Not a valid email"),
});

const passwordSchema = object({
  passwordResetCode: string().min(1, {
    message: "OTP is required",
  }),
  password: string().min(6, "Password should be 6 characters minimum"),
  passwordConfirmation: string().min(1, {
    message: "Please confirm your password",
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

// create type to pass in useForm
type EmailInput = TypeOf<typeof emailSchema>;
type PasswordInput = TypeOf<typeof passwordSchema>;

const ResetPassword = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = changePassword
  //   ? useForm<PasswordInput>({
  //       resolver: zodResolver(passwordSchema),
  //     })
  //   : useForm<EmailInput>({
  //       resolver: zodResolver(emailSchema),
  //     });

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<EmailInput>({
  //   resolver: zodResolver(emailSchema),
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
  });

  const handleGetOTP = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/forgotpassword`,
        { email: email },
        { withCredentials: true }
      );
      console.log(res);
      setOtpMessage(res.data);
      setChangePassword(true);
    } catch (e: any) {
      console.log(e);
      setOtpError(e.message);
    }
  };

  const onChangePassword = async (values: PasswordInput) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/resetPassword/${userId}`,
        values,
        { withCredentials: true }
      );
      console.log(res);
      setMessage(res.data);
      setOtpMessage("");
      setChangePassword(false);
    } catch (e: any) {
      console.log(e);
      setOtpError(e.message);
    }
  };

  return (
    <div className="bg-slate-50 max-w-sm rounded-xl shadow-lg flex flex-col justify-center mt-14 px-4 py-8 mx-auto">
      <button
        onClick={() => navigate("/home")}
        className="my-4 px-2 py-1 bg-blue-500 rounded-xl w-fit text-white"
      >
        Go home
      </button>
      <h1 className="text-4xl">Reset Password</h1>
      <p className="text-xs text-red-500 mt-3">{otpError}</p>
      <p className="text-sm text-green-500 mt-3">{otpMessage}</p>
      <p className="text-sm text-green-500 mt-3">{message}</p>

      {changePassword ? (
        <>
          <form onSubmit={handleSubmit(onChangePassword)} className="form-box">
            <div className="form-element">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="000000"
                {...register("passwordResetCode")}
              />
              <p className="text-sm text-red-500">{`${
                errors?.password?.message ? errors?.password?.message : ""
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
              Change password
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-4 text-md">
            You'll recieve an OTP on your registered email, please enter your
            registered email.
          </p>
          <form onSubmit={handleGetOTP} className="form-box">
            <div className="form-element">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="btn" type="submit">
              Get Code
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
