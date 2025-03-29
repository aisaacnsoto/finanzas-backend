import { QueryRunner } from "typeorm";
import { Transaction } from "../entities/Transaction";

export class TransactionUtil {

    static async saveTransaction(queryRunner: QueryRunner, data: any) {
        let transaction = new Transaction();
        transaction.account = data.account;
        transaction.category = data.category;
        transaction.tipo_transaccion_id = data.tipo_transaccion_id;
        transaction.monto = data.monto;
        transaction.fecha = new Date();
        transaction.descripcion = data.descripcion;
        transaction.user_id = data.user_id;
        if (!(await queryRunner.manager.save(transaction))) {
            throw new Error("No se pudo guardar la transacción");
        }
        return { transaction };
    }
}