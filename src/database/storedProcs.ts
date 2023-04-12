import config from 'config'
import sql from 'mssql';
import logger from '../utils/logger'

const dbConfig = config.get<string>('dev.db')

export async function getBanks() {
  try {
    const pool = sql.connect(dbConfig);
    const result = await (await pool)
      .request()
      .execute('dbo.banks_getBanks');
    logger.info(result);
    return result;
  } catch (err) {
    logger.error(err);
    return err;
  }
}