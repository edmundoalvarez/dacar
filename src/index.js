//Services --->

//FURNITURE
export { createFurniture } from "./services/Furniture/createFurniture.js";
export { getAllFurnitures } from "./services/Furniture/getAllFurnitures.js";
export { getFurnitureById } from "./services/Furniture/getFurnitureById.js";
export { updateModuleOfFurniture } from "./services/Furniture/updateModuleOfFurniture.js";
//MAIN TABLE
export { createMainTable } from "./services/mainTable/createMainTable.js";
// export { getAllTables } from "./services/mainTable/getAllTables.js";
//MODULES
export { createModule } from "./services/ModulesForFurniture/createModule.js";
export { getAllModules } from "./services/ModulesForFurniture/getAllModules.js";
export { getModuleById } from "./services/ModulesForFurniture/getModuleById.js";
export { updateModule } from "./services/ModulesForFurniture/updateModule.js";

//PIECES
export { createPieces } from "./services/Pieces/createPieces.js";
export { getAllPieces } from "./services/Pieces/getAllPieces.js";
export { getPiecesByModuleId } from "./services/Pieces/getPiecesByModuleId.js";
export { deletePiece } from "./services/Pieces/deletePiece.js";
export { getModuleAndPiecesByModuleId } from "./services/Pieces/getModuleAndPiecesByModuleId.js";
export { updatePiece } from "./services/Pieces/updatePiece.js";

//SUPPLIES
export { createSupplies } from "./services/Supplies/createSupplies.js";
export { getAllSupplies } from "./services/Supplies/getAllSupplies.js";
export { getAllTables } from "./services/Supplies/getAllTables.js";
export { getAllSuppliesExceptTables } from "./services/Supplies/getAllSuppliesExceptTables.js";

//CLIENTS
export { createClient } from "./services/Clients/createClient.js";
export { getAllClients } from "./services/Clients/getAllClients.js";

//Components --->

//MODULES
export { ProtectedRoute } from "./components/ProtectedRoute.jsx";
export { FormCreatePieces } from "./components/ComponentModules/FormCreatePieces.jsx";
export { FormEditPieces } from "./components/ComponentModules/FormEditPieces.jsx";
export { FormAddSupplies } from "./components/ComponentModules/FormAddSupplies.jsx";
export { FormEditSupplies } from "./components/ComponentModules/FormEditSupplies.jsx";
//FURNITURE
export { EditFurnitureSingleModuleComponent } from "./components/ComponentFurnitures/EditFurnitureSingleModuleComponent.jsx";
export { EditFurnitureComponent } from "./components/ComponentFurnitures/EditFurnitureComponent.jsx";

//CLIENTS
export { FormCreateClient } from "./components/ComponentClients/FormCreateClient.jsx";

//Views --->

export { Home } from "./views/Home";
export { NotFoundPage } from "./views/404/NotFoundPage";
//FURNITURE
export { Furniture } from "./views/Furniture/Furniture";
export { CreateFurniture } from "./views/Furniture/CreateFurniture";
// export { EditFurnitureSingleModule } from "./views/Furniture/EditFurnitureSingleModule.jsx";
export { EditFurnitureMultipleModules } from "./views/Furniture/EditFurnitureMultipleModules";

//MAIN TABLE
export { MainTable } from "./views/MainTable/MainTable";
export { CreateMainTable } from "./views/MainTable/CreateMainTable";
//MODULES
export { Modules } from "./views/ModulesForFurniture/Modules";
export { CreateModule } from "./views/ModulesForFurniture/CreateModule";
export { EditModule } from "./views/ModulesForFurniture/EditModule";
//PIECES
export { Pieces } from "./views/PiecesForModules/Pieces";
//SUPPLIES
export { Supplies } from "./views/Supplies/Supplies";
export { CreateSupplie } from "./views/Supplies/CreateSupplie";

//BUDGETS
export { CreateBudget } from "./views/Budgets/CreateBudget";
