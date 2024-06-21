import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
//** COMPONENTES PRINCIPALES **//
import {
  Home,
  NotFoundPage,
  ProtectedRoute,
  Furniture,
  CreateFurniture,
  MainTable,
  CreateMainTable,
  Modules,
  CreateModule,
  Pieces,
} from "./index.js";

function App() {
  return (
    <>
      {/*    {<NavBar />} */}
      <Routes>
        {/* Error 404 */}
        <Route path="*" element={<NotFoundPage />}></Route>
        {/* vistas protegidas */}
        <Route element={<ProtectedRoute />}>
          {/*         <Route path="/mi-cuenta/:view" element={<MyAccount />} /> */}
        </Route>
        {/* vistas no protegidas */}
        <Route path="/" element={<Home />} />
        <Route path="/ver-muebles" element={<Furniture />} />
        <Route path="/crear-mueble" element={<CreateFurniture />} />
        <Route path="/ver-tablas" element={<MainTable />} />
        <Route path="/crear-main-table" element={<CreateMainTable />} />
        <Route path="/ver-modulos" element={<Modules />} />
        <Route path="/crear-modulo" element={<CreateModule />} />
        <Route path="/ver-modulos/:id/piezas" element={<Pieces />} />
      </Routes>
      {/*     {<Footer />} */}
    </>
  );
}

export default App;
