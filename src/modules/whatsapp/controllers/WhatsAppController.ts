import { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";
import { AppDataSource } from "../../../data-source";
import { GlobalConstants } from "../../shared/utils/constants";
import { TransactionUtil } from "../../transactions/utils/TransactionUtil";
import { UserUtil } from "../../users/utils/UserUtil";
import { AccountUtil } from "../../accounts/utils/AccountUtil";
import { CategoryUtil } from "../../categories/utils/CategoryUtil";
import { ParameterUtil } from "../../shared/utils/ParameterUtil";
import { BudgetUtil } from "../../budgets/utils/BudgetUtil";
import { Budget } from "../../budgets/entities/Budget";
import { WhatsAppUtil } from "../utils/WhatsAppUtil";
import { WhatsAppTemplate } from "../utils/WhatsAppTemplate";

export class WhatsAppController {

    async getDataByID(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            // Obtener datos del request
            const { phone_number } = request.params;
            let { user, person } = await UserUtil.getUser(queryRunner, { phone_number });

            // Obtener cuentas
            let { accounts } = await AccountUtil.getAccounts(queryRunner, { user_id: user.id });
            let accountsNames = accounts.map((account) => `${account.id}-${account.nombre}`).join(" ");

            // Obtener categorias de ingreso
            let { categories: ingreso } = await CategoryUtil.getCategories(queryRunner, { user_id: user.id, tipo_transaccion_id: GlobalConstants.TIPO_TRANSACCION_INGRESO });
            let catIngresoNames = ingreso.map((category) => `${category.id}-${category.nombre}`).join(" ");

            // Obtener categorias de gasto
            let { categories: gasto } = await CategoryUtil.getCategories(queryRunner, { user_id: user.id, tipo_transaccion_id: GlobalConstants.TIPO_TRANSACCION_GASTO });
            let catGastoNames = gasto.map((category) => `${category.id}-${category.nombre}`).join(" ");

            response.status(200).json({ cuentas: accountsNames, ingreso_categorias: catIngresoNames, gasto_categorias: catGastoNames });
        } catch (err) {
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

    async saveTransaction(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const {
                phone_number,
                cuenta_id,
                categoria_id,
                tipo_transaccion_id,
                monto,
                descripcion
            } = request.body;
            if (!phone_number || !cuenta_id || !categoria_id || !tipo_transaccion_id || !monto) {
                return response.status(400).json({ message: "Faltan datos requeridos." });
            }
            let { user, person } = await UserUtil.getUser(queryRunner, { phone_number });
            let { account } = await AccountUtil.getAccount(queryRunner, { id: cuenta_id, user_id: user.id });
            let { category } = await CategoryUtil.getCategory(queryRunner, { id: categoria_id, user_id: user.id });
            let { parameter } = await ParameterUtil.getParameter(queryRunner, { parametro_valor: tipo_transaccion_id, parametro_clave: GlobalConstants.KEY_TIPO_TRANSACCION });
            let params = {
                account,
                category,
                tipo_transaccion_id: parameter.parametro_valor,
                monto,
                descripcion,
                user_id: user.id
            };
            let { transaction } = await TransactionUtil.saveTransaction(queryRunner, params);
            let data = {
                user: person.first_name,
                account: account.nombre,
                category: category.nombre,
                tipo_transaccion: parameter.parametro_nombre,
                monto: transaction.monto,
                descripcion: transaction.descripcion
            };
            let whatsapp_message = WhatsAppUtil.getMessage(WhatsAppTemplate.TEMPLATE_REGISTRO_TRANSACCION, data);
            await queryRunner.commitTransaction();
            response.status(200).json({ message: "Operación exitosa.", whatsapp_message });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            response.status(500).json({ message: "Ha ocurrido un error en la operación: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

    async saveAccount(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const {
                phone_number,
                nombre,
                descripcion
            } = request.body;
            if (!phone_number || !nombre) {
                return response.status(400).json({ message: "Faltan datos requeridos." });
            }
            let { user, person } = await UserUtil.getUser(queryRunner, { phone_number });
            let params = {
                nombre,
                descripcion,
                user_id: user.id
            };
            let { account } = await AccountUtil.saveAccount(queryRunner, params);
            let data = {
                user: person.first_name,
                account: account.nombre,
                descripcion: account.descripcion
            };
            let whatsapp_message = WhatsAppUtil.getMessage(WhatsAppTemplate.TEMPLATE_REGISTRO_CUENTA, data);
            await queryRunner.commitTransaction();
            response.status(200).json({ message: "Operación exitosa.", whatsapp_message });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            response.status(500).json({ message: "Ha ocurrido un error en la operación: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

    async saveCategory(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const {
                phone_number,
                nombre,
                tipo_transaccion_id,
                descripcion
            } = request.body;
            if (!phone_number || !nombre || !tipo_transaccion_id) {
                return response.status(400).json({ message: "Faltan datos requeridos." });
            }
            let { user, person } = await UserUtil.getUser(queryRunner, { phone_number });
            let { parameter } = await ParameterUtil.getParameter(queryRunner, { parametro_valor: tipo_transaccion_id, parametro_clave: GlobalConstants.KEY_TIPO_TRANSACCION });
            let params = {
                nombre,
                tipo_transaccion_id: parameter.parametro_valor,
                descripcion,
                user_id: user.id
            };
            let { category } = await CategoryUtil.saveCategory(queryRunner, params);
            let data = {
                user: person.first_name,
                account: category.nombre,
                descripcion: category.descripcion,
                tipo: parameter.parametro_nombre
            };
            let whatsapp_message = WhatsAppUtil.getMessage(WhatsAppTemplate.TEMPLATE_REGISTRO_CATEGORIA, data);
            await queryRunner.commitTransaction();
            response.status(200).json({ message: "Operación exitosa.", whatsapp_message });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            response.status(500).json({ message: "Ha ocurrido un error en la operación: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

    async saveBudget(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const {
                phone_number,
                categoria_id,
                amount,
                descripcion
            } = request.body;
            if (!phone_number || !categoria_id || !amount) {
                return response.status(400).json({ message: "Faltan datos requeridos." });
            }
            let { user, person } = await UserUtil.getUser(queryRunner, { phone_number });
            let { category } = await CategoryUtil.getCategory(queryRunner, { id: categoria_id, user_id: user.id });
            let params = {
                category,
                amount,
                periodo_inicio: DateTime.now().startOf('month'),
                periodo_fin: DateTime.now().endOf('month'),
                descripcion,
                user_id: user.id,
            };
            let { budget } = await BudgetUtil.saveBudget(queryRunner, params);

            let mesActual = DateTime.now().setLocale('es').toFormat('MMMM yyyy');
            mesActual = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

            let data = {
                user: person.first_name,
                categoria: category.nombre,
                monto: budget.amount,
                mes: mesActual
            };
            let whatsapp_message = WhatsAppUtil.getMessage(WhatsAppTemplate.TEMPLATE_REGISTRO_PRESUPUESTO, data);

            await queryRunner.commitTransaction();
            response.status(200).json({ message: "Operación exitosa.", whatsapp_message });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            response.status(500).json({ message: "Ha ocurrido un error en la operación: " + err.message });
        } finally {
            await queryRunner.release();
        }
    }

}