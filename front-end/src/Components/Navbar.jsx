import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice.js";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-4 flex justify-between items-center shadow-md">
      <Link
        to="/"
        className="font-bold text-2xl sm:text-3xl hover:text-blue-400 transition-colors"
      >
        TeamCollab
      </Link>

      {user ? (
        <div className="flex items-center space-x-4">
          {user.name && (
            <span className="hidden sm:inline text-gray-300">{user.name}</span>
          )}

          <button
            onClick={() => dispatch(logout())}
            className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
