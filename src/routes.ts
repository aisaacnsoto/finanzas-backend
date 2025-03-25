import { UserController } from "./controller/UserController";
import { TransactionController } from "./controller/TransactionController";
import { CategoryController } from "./controller/CategoryController";
import { ExternalController } from "./controller/ExternalController";
import { TestController } from "./controller/TestController";

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
    }
];