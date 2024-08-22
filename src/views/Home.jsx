import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <div className="m-4 px-6">
        <h1 className="text-4xl">Bienvenido</h1>
        <div className="flex gap-4 mt-4 ga-6">
          <Link
            to={`/ver-presupuestos`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Presupuestos
          </Link>
          <Link
            to={`/ver-muebles`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Muebles
          </Link>
          <Link
            to={`/ver-modulos`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Módulos
          </Link>
          <Link
            to={`/ver-clientes`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Clientes
          </Link>
          <Link
            to={`/ver-insumos`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Insumos
          </Link>
          <Link
            to={`/ver-servicios`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Servicios
          </Link>
        </div>
      </div>
    </>
  );
}

export { Home };
