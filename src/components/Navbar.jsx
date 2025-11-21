import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="w-full bg-gray-900 text-white py-2 px-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50 text-sm">
      {/* Logo / Home */}
      <Link to="/" className="ps-4 flex items-center">
        <img src="/logo-dacar-blanco.svg" alt="Dacar logo" className="h-4" />
      </Link>

      {/* Info usuario + logout */}
      <div className="flex items-center gap-3">
        <span className="text-xs sm:text-sm">
          {user.username}{" "}
          <span className="text-emerald-400 font-semibold">
            ({user.role === 1 ? "Admin" : "Común"})
          </span>
        </span>

        <button
          onClick={logout}
          className="bg-red-800 hover:bg-red-500 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Navbar;
