import { UserController } from "./controller/UserController";
import { TransactionController } from "./controller/TransactionController";
import { CategoryController } from "./controller/CategoryController";
import { ExternalController } from "./controller/ExternalController";
import { TestController } from "./controller/TestController";
import { DashboardController } from "./controller/DashboardController";

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
    { // => /external/data/<phone_number>
        method: "get",
        route: "/external/data/:id",
        controller: ExternalController,
        action: "getDataByID"
    },
    {
        method: "post",
        route: "/external/transactions",
        controller: ExternalController,
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