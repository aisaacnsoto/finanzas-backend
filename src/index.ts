import "dotenv/config";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { Router } from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();
    
    // register express routes from defined application routes
    const router = Router();
    Routes.forEach(route => {
        (router as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    });

    // setup express app here
    app.use(bodyParser.json());
    app.use(cors());
    app.use("/api", router);

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log("Express server has started on port "+port);

}).catch(error => console.log(error));
