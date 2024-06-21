import { useParams, Link } from "react-router-dom";
function Home() {
  return (
    <>
      <div className="m-4">
        <h1 className="text-4xl">Bienvenido</h1>
        <div className="flex gap-4 mt-4 ga-6">
          <Link
            to={`/ver-tablas`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Ver tablas
          </Link>
          <Link
            to={`/ver-modulos`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Ver módulos
          </Link>
          <Link
            to={`/ver-muebles`}
            className="bg-dark py-2 px-4 rounded-xl hover:bg-emerald-600 text-light font-medium "
          >
            Ver muebles
          </Link>
        </div>
      </div>
    </>
  );
}

export { Home };
