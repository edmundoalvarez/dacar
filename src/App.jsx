import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
//** COMPONENTES PRINCIPALES **//
import {
  Home,
  NotFoundPage,
  ProtectedRoute,
  MainTable,
  CreateMainTable,
  Modules,
  CreateModule,
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
        <Route path="/ver-tablas" element={<MainTable />} />
        <Route path="/crear-main-table" element={<CreateMainTable />} />
        <Route path="/ver-modulos" element={<Modules />} />
        <Route path="/crear-modulo" element={<CreateModule />} />
      </Routes>
      {/*     {<Footer />} */}
    </>
  );
}

export default App;
