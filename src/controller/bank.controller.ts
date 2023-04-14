import { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"
export function createBankHandler(req: Request, res: Response){
    try {

    } catch (err: any) {
        logger.error(err)
        return res.status(409).send(err.message)
    }
}