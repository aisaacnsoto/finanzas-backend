import { AppDataSource } from "../../../data-source";
import { NextFunction, Request, Response } from "express";
import { Account } from "../../accounts/entities/Account";
import { GlobalConstants } from "../../shared/utils/constants";
import { User } from "../../users/entities/User";
import { Category } from "../../categories/entities/Category";
import { Transaction } from "../entities/Transaction";

export class TransactionController {

    async save(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Obtener datos del request
            let user = await queryRunner.manager.getRepository(User).findOneBy({id: 1, estado: true});
            let account = await queryRunner.manager.getRepository(Account).findOneBy({id: 1, user_id: user.id, estado: true});
            let category = await queryRunner.manager.getRepository(Category).findOneBy({id: 2, user_id: user.id, estado: true});

            // Crear transaccion
            let transaction = new Transaction();
            transaction.account = account;
            transaction.category = category;
            transaction.tipo_transaccion_id = GlobalConstants.TIPO_TRANSACCION_GASTO;
            transaction.monto = 100.00;
            transaction.fecha = new Date();
            transaction.descripcion = "Prueba de transaccion";
            transaction.user_id = user.id;
            await queryRunner.manager.save(transaction);
            
            await queryRunner.commitTransaction();
            response.status(200).json({ message: "Transaccion ha sido guardada.", data: transaction });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

}