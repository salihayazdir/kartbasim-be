import config from 'config'
import sql, { IProcedureResult, MSSQLError } from 'mssql';
import logger from '../utils/logger'
import { Bank } from '../models/bank.model';

const dbConfig = config.get<string>('dev.db')

export async function getBanksProc(): Promise<IProcedureResult<Bank>> {
  try {
    const pool = sql.connect(dbConfig);
    const result = await (await pool)
      .request()
      .execute('dbo.banks_getBanks');
    logger.info(result);
    return result;
  } catch (err: any) {
    logger.error(err);
    return err.message;
  }
}