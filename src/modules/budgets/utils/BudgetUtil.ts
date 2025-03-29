import { QueryRunner } from "typeorm";
import { Budget } from "../entities/Budget";

export class BudgetUtil {

    static async saveBudget(queryRunner: QueryRunner, data: any) {
        let budget = new Budget();
        budget.category = data.category;
        budget.amount = data.amount;
        budget.periodo_inicio = data.periodo_inicio;
        budget.periodo_fin = data.periodo_fin;
        budget.descripcion = data.descripcion;
        budget.user_id = data.user_id;
        if (!(await queryRunner.manager.save(budget))) {
            throw new Error("No se pudo guardar guardar el presupuesto");
        }
        return { budget };
    }
}