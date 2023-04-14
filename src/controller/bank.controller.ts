import { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"
import { getBanks } from "../service/bank.service"
import { GetBanksInput } from "../schema/bank.schema"

export async function getBanksHandler(req: Request<{},{}, GetBanksInput['body']>, res: Response){
    try {
        const banksRecordset = await getBanks()
        const responseObject = {
            success: true,
            recordset: banksRecordset
        } 
        return res.send(responseObject)
    } catch (err: any) {
        logger.error(err)
        return res.status(409).send(err.message)
    }
}