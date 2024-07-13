import "./App.css";
import { Routes, Route /* useLocation */ } from "react-router-dom";
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
  Supplies,
  CreateSupplie,
  EditFurnitureSingleModule,
  EditFurnitureMultipleModules,
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
        <Route path="/ver-placas" element={<MainTable />} />
        <Route path="/crear-placa" element={<CreateMainTable />} />
        <Route path="/ver-modulos" element={<Modules />} />
        <Route path="/crear-modulo" element={<CreateModule />} />
        <Route path="/ver-modulos/:id/piezas" element={<Pieces />} />
        <Route
          path="/ver-muebles/:idForniture/ver-modulos/:idModule/edit"
          element={<EditFurnitureSingleModule />}
        />
        <Route
          path="/editar-modulos-mueble/:idForniture"
          element={<EditFurnitureMultipleModules />}
        />
        <Route path="/ver-insumos" element={<Supplies />} />
        <Route path="/crear-insumo" element={<CreateSupplie />} />
      </Routes>
      {/*     {<Footer />} */}
    </>
  );
}

export default App;
