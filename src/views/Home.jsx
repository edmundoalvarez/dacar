import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ajustá el path si es necesario

function Home() {
  const { logout } = useContext(AuthContext);
  const ENV = import.meta.env.VITE_ENV;

  const bgColorClass = ENV === "PROD" ? "bg-gray-800" : "bg-yellow-700";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`border-2 ${bgColorClass} py-14 rounded-xl w-[800px] flex flex-col items-center justify-center gap-8`}
      >
        {ENV === "TEST" && (
          <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-sm font-semibold">
            ⚠️ Estás en entorno de pruebas (TEST)
          </div>
        )}
        <h1 className="text-4xl text-center font-bold text-white">
          Bienvenido
        </h1>

        <div className="flex flex-row flex-wrap justify-center gap-4 mt-4 w-[800px]">
          <Link
            to={`/ver-presupuestos`}
            className="bg-emerald-600 border-2 border-emerald-500 py-4 px-4 rounded-xl hover:bg-emerald-500 text-light font-medium w-[200px] text-center flex flex-row justify-center gap-4"
          >
            <img
              src="./icon_budgets.svg"
              alt="Icono de budgets"
              className="w-[24px]"
            />
            <p className="m-0 leading-loose">Presupuestos</p>
          </Link>
          <Link
            to={`/ver-modulos`}
            className="bg-emerald-600 border-2 border-emerald-500 py-4 px-4 rounded-xl hover:bg-emerald-500 text-light font-medium w-[200px] text-center flex flex-row justify-center gap-4"
          >
            <img
              src="./icon_modules.svg"
              alt="Icono de budgets"
              className="w-[28px]"
            />
            <p className="m-0 leading-loose">Módulos</p>
          </Link>
          <Link
            to={`/ver-muebles`}
            className="bg-emerald-600 border-2 border-emerald-500 py-4 px-4 rounded-xl hover:bg-emerald-500 text-light font-medium w-[200px] text-center flex flex-row justify-center gap-4"
          >
            <img
              src="./icon_furnitures.svg"
              alt="Icono de budgets"
              className="w-[24px]"
            />
            <p className="m-0 leading-loose">Muebles</p>
          </Link>
          <Link
            to={`/ver-insumos`}
            className="bg-emerald-600 border-2 border-emerald-500 py-4 px-4 rounded-xl hover:bg-emerald-500 text-light font-medium w-[200px] text-center flex flex-row justify-center gap-4"
          >
            <img
              src="./icon_supplies.svg"
              alt="Icono de budgets"
              className="w-[24px]"
            />
            <p className="m-0 leading-loose">Insumos</p>
          </Link>

          <Link
            to={`/ver-servicios`}
            className="bg-emerald-600 border-2 border-emerald-500 py-4 px-4 rounded-xl hover:bg-emerald-500 text-light font-medium w-[200px] text-center flex flex-row justify-center gap-4"
          >
            <img
              src="./icon_services.svg"
              alt="Icono de budgets"
              className="w-[24px]"
            />
            <p className="m-0 leading-loose">Servicios</p>
          </Link>
          <Link
            to={`/ver-clientes`}
            className="bg-emerald-600 border-2 border-emerald-500 py-4 px-4 rounded-xl hover:bg-emerald-500 text-light font-medium w-[200px] text-center flex flex-row justify-center gap-4"
          >
            <img
              src="./icon_clients.svg"
              alt="Icono de budgets"
              className="w-[24px]"
            />
            <p className="m-0 leading-loose">Clientes</p>
          </Link>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500 font-semibold"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export { Home };
