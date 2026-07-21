import "./App.css";
import { Routes, Route /* useLocation */ } from "react-router-dom";
//** COMPONENTES PRINCIPALES **//
import {
  Login,
  Home,
  NotFoundPage,
  ProtectedRoute,
  Furniture,
  //Furniture
  CreateFurniture,
  //FurnitureCategories
  FurnitureCategories,
  CreateFurnitureCategory,
  EditFurnitureCategory,
  //Piece
  Pieces,
  // Modulos
  Modules,
  CreateModule,
  EditModule,
  EditFurnitureMultipleModules,
  //Insumos
  Supplies,
  CreateSupplie,
  EditSupplie,
  //Servicios
  ServicesFurniture,
  CreateServicesFurniture,
  EditService,
  //Presupuesto
  CreateBudget,
  Budgets,
  BudgetDetails,
  EditBudget,
  SelectFurnitures,
  ConfirmedBudgetsReport,
  //Clientes
  Clients,
  CreateClient,
  EditClient,
  //Usuarios
  Users,
  CreateUser,
  EditUser,
  //System Variables
  SystemVariables,
} from "./index.js";

import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      {/*    {<NavBar />} */}
      <Navbar />
      <div className="pt-10">
        <Routes>
          {/* RUTAS NO PROTEGIDAS */}
          <Route path="/iniciar-sesion" element={<Login />} />
          {/* Error 404 */}
          <Route path="*" element={<NotFoundPage />}></Route>
          {/* vistas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/ver-muebles" element={<Furniture />} />
            <Route path="/crear-mueble" element={<CreateFurniture />} />
            {/* furniture categories */}
            <Route
              path="/ver-categorias-muebles"
              element={<FurnitureCategories />}
            />
            <Route
              path="/crear-categoria-mueble"
              element={<CreateFurnitureCategory />}
            />
            <Route
              path="/editar-categoria-mueble/:categoryId"
              element={<EditFurnitureCategory />}
            />
            <Route path="/ver-modulos" element={<Modules />} />
            <Route path="/crear-modulo" element={<CreateModule />} />
            <Route path="/editar-modulo/:idModule" element={<EditModule />} />
            <Route path="/ver-modulos/:moduleId/piezas" element={<Pieces />} />
            <Route
              path="/editar-modulos-mueble/:idFurniture"
              element={<EditFurnitureMultipleModules />}
            />
            <Route path="/ver-insumos" element={<Supplies />} />
            <Route path="/crear-insumo" element={<CreateSupplie />} />
            <Route path="/editar-insumo/:idSupplie" element={<EditSupplie />} />
            {/* servicios */}
            <Route path="/ver-servicios" element={<ServicesFurniture />} />
            <Route
              path="/crear-servicio"
              element={<CreateServicesFurniture />}
            />
            <Route
              path="/editar-servicio/:idService"
              element={<EditService />}
            />
            {/* presupuestos */}
            <Route path="/ver-presupuestos" element={<Budgets />} />
            <Route
              path="/seleccionar-muebles"
              element={<SelectFurnitures />}
            />
            <Route
              path="/presupuestar-mueble/:idFurniture"
              element={<CreateBudget />}
            />
            <Route
              path="/ver-presupuestos/:idBudget"
              element={<BudgetDetails />}
            />
            <Route
              path="/editar-presupuestos/:budgetId"
              element={<EditBudget />}
            />
            <Route
              path="/reporte-presupuestos-confirmados"
              element={<ConfirmedBudgetsReport />}
            />
            {/* clientes */}
            <Route path="/ver-clientes" element={<Clients />} />
            <Route path="/crear-cliente" element={<CreateClient />} />
            <Route path="/editar-cliente/:clientId" element={<EditClient />} />
            {/* usuarios */}
            <Route path="/ver-usuarios" element={<Users />} />
            <Route path="/crear-usuario" element={<CreateUser />} />
            <Route path="/editar-usuario/:userId" element={<EditUser />} />
            {/* variables del sistema */}
            <Route path="/variables-sistema" element={<SystemVariables />} />
          </Route>
          {/* vistas no protegidas */}
        </Routes>
        {/*     {<Footer />} */}
      </div>
    </>
  );
}

export default App;
