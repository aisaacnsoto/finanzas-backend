import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { Category } from "../entity/Category";
import { Person } from "../entity/Person";
import { Account } from "../entity/Account";
import { Transaction } from "../entity/Transaction";
import { GlobalConstants } from "../shared/constants";
import { Parameter } from "../entity/Parameter";
import { TransactionUtil } from "./TransactionUtil";

export class ExternalController {

    async getDataByID(request: Request, response: Response, next: NextFunction) {
        try {
            // Obtener datos del request
            const { id } = request.params;
            let person = await AppDataSource.getRepository(Person).findOneBy({phone_number: id, estado: true});
            let user = await AppDataSource.getRepository(User).findOne({where: {person: {id: person.id}, estado: true}});
            
            // Obtener cuentas
            let accounts = await AppDataSource.getRepository(Account).findBy({user_id: user.id, estado: true});
            let accountsNames = accounts.map((account) => `${account.id}-${account.nombre}`).join(" ");

            // Obtener categorias de ingreso
            let catIngreso = await AppDataSource.getRepository(Category).findBy({user_id: user.id, tipo_transaccion_id: GlobalConstants.TIPO_TRANSACCION_INGRESO, estado: true});
            let catIngresoNames = catIngreso.map((category) => `${category.id}-${category.nombre}`).join(" ");

            // Obtener categorias de gasto
            let catGasto = await AppDataSource.getRepository(Category).findBy({user_id: user.id, tipo_transaccion_id: GlobalConstants.TIPO_TRANSACCION_GASTO, estado: true});
            let catGastoNames = catGasto.map((category) => `${category.id}-${category.nombre}`).join(" ");

            response.status(200).json({ cuentas: accountsNames, ingreso_categorias: catIngresoNames, gasto_categorias: catGastoNames });
        } catch (err) {
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        }
    }

    async saveTransaction(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Obtener datos del request
            const {
                user_id,
                cuenta_id,
                categoria_id,
                tipo_transaccion_id,
                monto,
                descripcion
            } = request.body;
            let person = await queryRunner.manager.getRepository(Person).findOneBy({phone_number: user_id, estado: true});
            console.log(person);
            if (!person) {
                throw new Error("No se encontró la persona");
            }
            let user = await queryRunner.manager.getRepository(User).findOneBy({person: {id: person.id}, estado: true});
            if (!user) {
                throw new Error("No se encontró el usuario");
            }

            let account = await queryRunner.manager.getRepository(Account).findOneBy({id: cuenta_id, user_id: user.id, estado: true});
            let category = await queryRunner.manager.getRepository(Category).findOneBy({id: categoria_id, user_id: user.id, estado: true});
            let parametro = await queryRunner.manager.getRepository(Parameter).findOneBy({parametro_valor: tipo_transaccion_id, parametro_clave: GlobalConstants.KEY_TIPO_TRANSACCION, estado: true});
            // Crear transaccion
            let params = { account, category, parametro_valor: parametro.parametro_valor, monto, descripcion, user_id: user.id };
            let transaction = await TransactionUtil.save(queryRunner, params);

            let data = {
                user: person.first_name,
                account: account.nombre,
                category: category.nombre,
                tipo_transaccion: parametro.parametro_nombre,
                monto: transaction.monto,
                descripcion: transaction.descripcion
            };
            await queryRunner.commitTransaction();
            response.status(200).json({ message: "Transaccion ha sido guardada.", data });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

}