import { QueryRunner } from "typeorm";
import { Transaction } from "../entity/Transaction";

export class TransactionUtil {

    static async save(queryRunner: QueryRunner, data: any) {
        let transaction = new Transaction();
        transaction.account = data.account;
        transaction.category = data.category;
        transaction.tipo_transaccion_id = parseInt(data.parametro_valor);
        transaction.monto = data.monto;
        transaction.fecha = new Date();
        transaction.descripcion = data.descripcion;
        transaction.user_id = data.user_id;
        return await queryRunner.manager.save(transaction);
    }
}