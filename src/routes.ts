import { UserController } from "./modules/users/controllers/UserController";
import { TransactionController } from "./modules/transactions/controllers/TransactionController";
import { CategoryController } from "./modules/categories/controllers/CategoryController";
import { WhatsAppController } from "./modules/whatsapp/controllers/WhatsAppController";
import { TestController } from "./modules/test/controllers/TestController";
import { DashboardController } from "./modules/dashboard/controllers/DashboardController";

export const Routes = [
    {
        method: "get",
        route: "/test",
        controller: TestController,
        action: "test"
    },
    {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    },
    {
        method: "post",
        route: "/transactions",
        controller: TransactionController,
        action: "save"
    },
    {
        method: "get",
        route: "/categories/:id",
        controller: CategoryController,
        action: "allByID"
    },
    { // => /whatsapp/data/<phone_number>
        method: "get",
        route: "/whatsapp/data/:id",
        controller: WhatsAppController,
        action: "getDataByID"
    },
    {
        method: "post",
        route: "/whatsapp/transactions",
        controller: WhatsAppController,
        action: "saveTransaction"
    },
    {
        method: "get",
        route: "/dashboard/ranking/categories",
        controller: DashboardController,
        action: "getRankingCategorias"
    },
    {
        method: "get",
        route: "/dashboard/presupuesto/categories",
        controller: DashboardController,
        action: "getPresupuestoPorCategorias"
    },
    {
        method: "get",
        route: "/dashboard/presupuesto/category",
        controller: DashboardController,
        action: "getPresupuestoPorCategoria"
    }
];