//Services ->
//FURNITURE
export { createFurniture } from "./services/Furniture/createFurniture.js";
export { getAllFurnitures } from "./services/Furniture/getAllFurnitures.js";
//MAIN TABLE
export { createMainTable } from "./services/mainTable/createMainTable.js";
export { getAllTables } from "./services/mainTable/getAllTables.js";
//MODULES
export { createModule } from "./services/ModulesForForniture/createModule.js";
export { getAllModules } from "./services/ModulesForForniture/getAllModules.js";
export { getModuleById } from "./services/ModulesForForniture/getModuleById.js";
//PIECES
export { createPieces } from "./services/Pieces/createPieces.js";
export { getAllPieces } from "./services/Pieces/getAllPieces.js";

//Components ->
export { ProtectedRoute } from "./components/ProtectedRoute.jsx";
export { FormCreatePieces } from "./components/ComponentModules/FormCreatePieces.jsx";

//Views ->
export { Home } from "./views/Home";
export { NotFoundPage } from "./views/404/NotFoundPage";
//FURNITURE
export { Furniture } from "./views/Furniture/Furniture";
export { CreateFurniture } from "./views/Furniture/CreateFurniture";
//MAIN TABLE
export { MainTable } from "./views/MainTable/MainTable";
export { CreateMainTable } from "./views/MainTable/CreateMainTable";
//MODULES
export { Modules } from "./views/ModulesForForniture/Modules";
export { CreateModule } from "./views/ModulesForForniture/CreateModule";
//PIECES
export { Pieces } from "./views/PiecesForModules/Pieces";
