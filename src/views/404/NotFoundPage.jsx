import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <div>
        <h1>¡Oops!</h1>
        <p>No pudimos encontrar la pagina que estás buscando :c</p>
        <Link to="/">Volver al Inicio</Link>
      </div>
    </div>
  );
}

export { NotFoundPage };
