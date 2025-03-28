import { AppDataSource } from "../../../data-source";
import { NextFunction, Request, Response } from "express";
import { Person } from "../../users/entities/Person";
import { Account } from "../../accounts/entities/Account";
import { GlobalConstants } from "../../shared/utils/constants";
import { Parameter } from "../../shared/entities/Parameter";
import { User } from "../../users/entities/User";
import { Category } from "../../categories/entities/Category";
import { TransactionUtil } from "../../transactions/utils/TransactionUtil";
import { UserUtil } from "../../users/utils/UserUtil";
import { AccountUtil } from "../../accounts/utils/AccountUtil";
import { CategoryUtil } from "../../categories/utils/CategoryUtil";

export class WhatsAppController {

    async getDataByID(request: Request, response: Response, next: NextFunction) {
        try {
            // Obtener datos del request
            const { id } = request.params;
            let person = await AppDataSource.getRepository(Person).findOneBy({ phone_number: id, estado: true });
            let user = await AppDataSource.getRepository(User).findOne({ where: { person: { id: person.id }, estado: true } });

            // Obtener cuentas
            let accounts = await AppDataSource.getRepository(Account).findBy({ user_id: user.id, estado: true });
            let accountsNames = accounts.map((account) => `${account.id}-${account.nombre}`).join(" ");

            // Obtener categorias de ingreso
            let catIngreso = await AppDataSource.getRepository(Category).findBy({ user_id: user.id, tipo_transaccion_id: GlobalConstants.TIPO_TRANSACCION_INGRESO, estado: true });
            let catIngresoNames = catIngreso.map((category) => `${category.id}-${category.nombre}`).join(" ");

            // Obtener categorias de gasto
            let catGasto = await AppDataSource.getRepository(Category).findBy({ user_id: user.id, tipo_transaccion_id: GlobalConstants.TIPO_TRANSACCION_GASTO, estado: true });
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
            let { user, person } = await UserUtil.getUser(queryRunner, { phone_number: user_id });
            let { account } = await AccountUtil.getAccount(queryRunner, { id: cuenta_id, user_id: user.id });
            let { category } = await CategoryUtil.getCategory(queryRunner, { id: cuenta_id, user_id: user.id });
            let parametro = await queryRunner.manager.getRepository(Parameter).findOneBy({ parametro_valor: tipo_transaccion_id, parametro_clave: GlobalConstants.KEY_TIPO_TRANSACCION, estado: true });
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