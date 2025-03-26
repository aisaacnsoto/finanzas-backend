import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { Account } from "../entity/Account";
import { Category } from "../entity/Category";
import { Parameter } from "../entity/Parameter";
import { GlobalConstants } from "../shared/constants";
import { Person } from "../entity/Person";

export class DashboardController {

    async getRankingCategorias(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            let data = await queryRunner.query(`SELECT 
                c.nombre AS categoria,
                SUM(t.monto) AS total,
                ROUND(SUM(t.monto) / (SELECT SUM(monto) FROM transactions) * 100, 2) AS porcentaje
            FROM 
                transactions t
            JOIN 
                categories c ON c.id = t.categoria_id
            GROUP BY 
                c.id
            ORDER BY 
                total DESC`);
            await queryRunner.release();
            response.status(200).json({ data });
        } catch (err) {
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        } finally {
        }
    }

    async getPresupuestoPorCategorias(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            let data = await queryRunner.query(`SELECT 
    c.nombre AS categoria,
    b.amount as total_presupuesto,
    SUM(t.monto) AS total_gastado,
    b.amount - SUM(t.monto) AS saldo,
    ROUND(SUM(t.monto) / b.amount * 100, 2) AS porcentaje
FROM 
    transactions t
JOIN 
    categories c ON c.id = t.categoria_id
LEFT JOIN
	budgets b on b.categoria_id = c.id
GROUP BY 
    c.id,
    b.amount
ORDER BY 
    total_gastado DESC`);
            await queryRunner.release();
            response.status(200).json({ data });
        } catch (err) {
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        } finally {
        }
    }

    async getPresupuestoPorCategoria(request: Request, response: Response, next: NextFunction) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            let data = await queryRunner.query(`SELECT 
    c.nombre AS categoria,
    b.amount as total_presupuesto,
    SUM(t.monto) AS total_gastado,
    b.amount - SUM(t.monto) AS saldo,
    ROUND(SUM(t.monto) / b.amount * 100, 2) AS porcentaje
FROM 
    transactions t
JOIN 
    categories c ON c.id = t.categoria_id
LEFT JOIN
	budgets b on b.categoria_id = c.id
GROUP BY 
    c.id,
    b.amount
ORDER BY 
    total_gastado DESC`);
            await queryRunner.release();
            response.status(200).json({ data: data[0] });
        } catch (err) {
            response.status(500).json({ message: "Ha ocurrido un error al guardar: " + err.message });
        } finally {
        }
    }

}