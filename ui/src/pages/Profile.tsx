import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => {
    return state.reducer.user;
  });

  return (
    <div className="max-w-sm rounded-xl shadow-lg flex flex-col justify-center mt-14 px-4 py-8 mx-auto">
      <button
        onClick={() => navigate("/home")}
        className="my-4 px-2 py-1 bg-blue-500 rounded-xl w-fit text-white"
      >
        Go home
      </button>

      <h1 className="text-4xl">Your Profile</h1>

      <p className="mt-4 text-xl">
        Name: {user.firstName + " " + user.lastName}
      </p>
      <p className="mt-4 text-xl">Email: {user.email}</p>
      <p className="mt-4 text-md">
        Change password?{" "}
        <Link
          to={`/reset/${user.userId}`}
          className="text-blue-500 hover:underline"
        >
          Click Here
        </Link>
      </p>
    </div>
  );
};

export default Profile;
