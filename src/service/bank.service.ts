import { Request } from "express";
import logger from "../utils/logger";
import { getBanksProc } from "../database/storedProcs";


export async function getBanks() {
    try {
        const dbResponse = await getBanksProc()
        return dbResponse.recordset
    } catch(err) {
        logger.error(err)
        return err
    }
}