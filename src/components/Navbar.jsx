import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  // Items del menú ABMs en orden alfabético
  const abmItems = [
    { name: "Cat. Muebles", path: "/ver-categorias-muebles", icon: "./icon_furnitures.svg" },
    { name: "Clientes", path: "/ver-clientes", icon: "./icon_clients.svg" },
    { name: "Insumos", path: "/ver-insumos", icon: "./icon_supplies.svg" },
    { name: "Servicios", path: "/ver-servicios", icon: "./icon_services.svg" },
    { name: "Usuarios", path: "/ver-usuarios", icon: "./icon_users.svg" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAbmActive = abmItems.some((item) => isActive(item.path));

  return (
    <div className="w-full bg-gray-900 text-white py-2 px-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50 text-sm">
      <div className="flex items-center gap-4">
        {/* Logo / Home */}
        <Link to="/" className="ps-4 flex items-center">
          <img src="/logo-dacar-blanco.svg" alt="Dacar logo" className="h-4" />
        </Link>

        {/* Menú de navegación */}
        <nav className="flex items-center gap-2">
          <Link
            to="/ver-presupuestos"
            className={`px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-gray-700 transition ${
              isActive("/ver-presupuestos") ? "bg-emerald-600" : ""
            }`}
          >
            Presupuestos
          </Link>
          <Link
            to="/reporte-presupuestos-confirmados"
            className={`px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-gray-700 transition ${
              isActive("/reporte-presupuestos-confirmados") ? "bg-emerald-600" : ""
            }`}
          >
            Pres. confirmados
          </Link>
          <Link
            to="/ver-modulos"
            className={`px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-gray-700 transition ${
              isActive("/ver-modulos") ? "bg-emerald-600" : ""
            }`}
          >
            Módulos
          </Link>
          <Link
            to="/ver-muebles"
            className={`px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-gray-700 transition ${
              isActive("/ver-muebles") ? "bg-emerald-600" : ""
            }`}
          >
            Muebles
          </Link>

          {/* Dropdown ABMs */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`px-3 py-1 rounded-md text-xs sm:text-sm hover:bg-gray-700 transition flex items-center gap-1 ${
                isAbmActive ? "bg-emerald-600" : ""
              }`}
            >
              ABMs
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-md shadow-lg min-w-[180px] border border-gray-700">
                {abmItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2 text-xs sm:text-sm hover:bg-gray-700 transition flex items-center gap-2 ${
                      isActive(item.path) ? "bg-emerald-600" : ""
                    }`}
                  >
                    <img src={item.icon} alt={item.name} className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

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
