import "./App.css";
import { Routes, Route /* useLocation */ } from "react-router-dom";
//** COMPONENTES PRINCIPALES **//
import {
  Home,
  NotFoundPage,
  ProtectedRoute,
  Furniture,
  CreateFurniture,
  Modules,
  CreateModule,
  EditModule,
  Pieces,
  Supplies,
  CreateSupplie,
  // EditFurnitureSingleModule,
  EditFurnitureMultipleModules,
  CreateBudget,
  EditSupplie,
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
        <Route path="/ver-modulos" element={<Modules />} />
        <Route path="/crear-modulo" element={<CreateModule />} />
        <Route path="/editar-modulo/:idModule" element={<EditModule />} />
        <Route path="/ver-modulos/:moduleId/piezas" element={<Pieces />} />
        {/* <Route
          path="/ver-muebles/:idFurniture/ver-modulos/:idModule/edit"
          element={<EditFurnitureSingleModule />}
        /> */}
        <Route
          path="/editar-modulos-mueble/:idFurniture"
          element={<EditFurnitureMultipleModules />}
        />
        <Route
          path="/presupuestar-mueble/:idFurniture"
          element={<CreateBudget />}
        />
        <Route path="/ver-insumos" element={<Supplies />} />
        <Route path="/crear-insumo" element={<CreateSupplie />} />
        <Route path="/editar-insumo/:idSupplie" element={<EditSupplie />} />
      </Routes>
      {/*     {<Footer />} */}
    </>
  );
}

export default App;
