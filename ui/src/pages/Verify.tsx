import { useNavigate, useParams } from "react-router-dom";
import { object, string, TypeOf } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSelector } from "react-redux";

//schema to validate verification code
const verifyUserSchema = object({
  verificationCode: string().min(1, {
    message: "Verificato code is required",
  }),
});

// create type to pass in useForm
type VerifyUserInput = TypeOf<typeof verifyUserSchema>;

const Verify = () => {
  const [verificationError, setVerificationError] = useState("");
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (user?.isVerified && user.userId) {
      navigate("/home");
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyUserInput>({
    resolver: zodResolver(verifyUserSchema),
  });

  const onSubmit = async (values: VerifyUserInput) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/verify/${userId}`,
        values
      );
      navigate(`/auth/login`);
    } catch (e: any) {
      setVerificationError(e.message);
    }
  };

  return (
    <div className="bg-slate-50 max-w-sm rounded-xl shadow-lg flex flex-col justify-center mt-14 px-4 py-8 mx-auto">
      <h1 className="text-4xl">Verify User</h1>
      <p className="text-sm text-red-500">{verificationError}</p>

      <p className="mt-6">Verification code sent to your email</p>
      <form onSubmit={handleSubmit(onSubmit)} className="form-box">
        <div className="form-element">
          <label htmlFor="verificationCode">Code</label>
          <input
            type="text"
            id="verificationCode"
            placeholder="verification code"
            {...register("verificationCode")}
          />
          <p className="text-sm text-red-500">{`${
            errors?.verificationCode?.message
              ? errors?.verificationCode?.message
              : ""
          }`}</p>
        </div>

        <button className="btn" type="submit">
          Verify
        </button>
      </form>
    </div>
  );
};

export default Verify;
