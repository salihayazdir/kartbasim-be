import { Express, Request, Response } from "express";
import { getBanksHandler } from "./controller/bank.controller";
import validateResource from "./middleware/validateResource";
import { getBanksSchema } from "./schema/bank.schema";

export default function routes(app: Express){

    app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200) )

    app.get('/api/banks', validateResource(getBanksSchema), getBanksHandler)
}