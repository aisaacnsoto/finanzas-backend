import { NextFunction, Request, Response } from "express";

export class TestController {

    async test(request: Request, response: Response, next: NextFunction) {
        response.status(200).json({ "message": "api working!!!" });
    }

}