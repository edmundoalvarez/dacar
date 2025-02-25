//Services --->

//FURNITURE
export { createFurniture } from "./services/Furniture/createFurniture.js";
export { getAllFurnitures } from "./services/Furniture/getAllFurnitures.js";
export { getAllFurnituresList } from "./services/Furniture/getAllFurnituresList.js";
export { getFurnitureById } from "./services/Furniture/getFurnitureById.js";
export { updateModuleOfFurniture } from "./services/Furniture/updateModuleOfFurniture.js";
export { deleteModuleOnFurniture } from "./services/Furniture/deleteModuleOnFurniture.js";
export { updateFurniture } from "./services/Furniture/updateFurniture.js";
export { filterFurnitureByName } from "./services/Furniture/filterFurnitureByName.js";
export { getLoosePiecesByFurnitureId } from "./services/Furniture/getLoosePiecesByFurnitureId.js";
export { getPiecesByFurnitureId } from "./services/Furniture/getPiecesByFurnitureId.js";
export { deleteFurniture } from "./services/Furniture/deleteFurniture.js";

//MODULES
export { createModule } from "./services/ModulesForFurniture/createModule.js";
export { getAllModules } from "./services/ModulesForFurniture/getAllModules.js";
export { getAllModulesList } from "./services/ModulesForFurniture/getAllModulesList.js";
export { getModuleById } from "./services/ModulesForFurniture/getModuleById.js";
export { updateModule } from "./services/ModulesForFurniture/updateModule.js";
export { updateModulePiecesNumber } from "./services/ModulesForFurniture/updateModulePiecesNumber.js";
export { cloneModule } from "./services/ModulesForFurniture/cloneModule.js";
export { deleteOriginalModule } from "./services/ModulesForFurniture/deleteOriginalModule.js";
export { filterModuleByName } from "./services/ModulesForFurniture/filterModuleByName.js";

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
export { getAllEdgesSupplies } from "./services/Supplies/getAllEdgesSupplies.js";
export { getAllVeneerSupplies } from "./services/Supplies/getAllVeneerSupplies.js";
export { getAllSuppliesExceptTables } from "./services/Supplies/getAllSuppliesExceptTables.js";
export { deleteSupplie } from "./services/Supplies/deleteSupplie.js";
export { getSupplieById } from "./services/Supplies/getSupplieById.js";
export { updateSupplie } from "./services/Supplies/updateSupplie.js";
export { filterSupplieByName } from "./services/Supplies/filterSupplieByName.js";

//SUPPLIES-CATEGORIES
export { getAllSuppliesCategories } from "./services/SuppliesCategories/getAllSuppliesCategories.js";

//SERVICES FURNITURE
export { getAllServices } from "./services/ServicesFurniture/getAllServices.js";
export { getAllServicesList } from "./services/ServicesFurniture/getAllServicesList.js";
export { createService } from "./services/ServicesFurniture/createService.js";
export { updateService } from "./services/ServicesFurniture/updateService.js";
export { getServiceById } from "./services/ServicesFurniture/getServiceById.js";
export { deleteService } from "./services/ServicesFurniture/deleteService.js";
export { filterServiceByName } from "./services/ServicesFurniture/filterServiceByName.js";

//CLIENTS
export { createClient } from "./services/Clients/createClient.js";
export { getAllClients } from "./services/Clients/getAllClients.js";
export { getAllClientsList } from "./services/Clients/getAllClientsList.js";
export { getClientById } from "./services/Clients/getClientById.js";
export { filterClientByName } from "./services/Clients/filterClientByName.js";
export { deleteClient } from "./services/Clients/deleteClient.js";
export { updateClient } from "./services/Clients/updateClient.js";

//BUDGETS
export { getAllBudgets } from "./services/Budgets/getAllBudgets.js";
export { createBudget } from "./services/Budgets/createBudget.js";
export { getLastBudgetNum } from "./services/Budgets/getLastBudgetNum.js";
export { getBudgetById } from "./services/Budgets/getBudgetById.js";
export { filterBudgetByClientName } from "./services/Budgets/filterBudgetByClientName.js";
export { deleteBudget } from "./services/Budgets/deleteBudget.js";
export { editBudget } from "./services/Budgets/editBudget.js";

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
export { ViewModulesFurniture } from "./components/ComponentFurnitures/ViewModulesFurniture.jsx";

//CLIENTS
export { FormCreateClient } from "./components/ComponentClients/FormCreateClient.jsx";

//Views --->

export { Home } from "./views/Home";
export { NotFoundPage } from "./views/404/NotFoundPage";
//FURNITURE
export { Furniture } from "./views/Furniture/Furniture";
export { CreateFurniture } from "./views/Furniture/CreateFurniture";
export { EditFurnitureMultipleModules } from "./views/Furniture/EditFurnitureMultipleModules";

//MODULES
export { Modules } from "./views/ModulesForFurniture/Modules";
export { CreateModule } from "./views/ModulesForFurniture/CreateModule";
export { EditModule } from "./views/ModulesForFurniture/EditModule";
//PIECES
export { Pieces } from "./views/PiecesForModules/Pieces";
//SUPPLIES
export { Supplies } from "./views/Supplies/Supplies";
export { CreateSupplie } from "./views/Supplies/CreateSupplie";
export { EditSupplie } from "./views/Supplies/EditSupplie";

//SERVICES FURNITURE
export { ServicesFurniture } from "./views/ServicesFurniture/ServicesFurniture";
export { CreateServicesFurniture } from "./views/ServicesFurniture/CreateServicesFurniture";
export { EditService } from "./views/ServicesFurniture/EditService";

//BUDGETS
export { CreateBudget } from "./views/Budgets/CreateBudget";
export { Budgets } from "./views/Budgets/Budgets";
export { BudgetDetails } from "./views/Budgets/BudgetDetails";
export { EditBudget } from "./views/Budgets/EditBudget";

//CLIENTS
export { Clients } from "./views/Clients/Clients";
export { CreateClient } from "./views/Clients/CreateClient";
export { EditClient } from "./views/Clients/EditClient";
