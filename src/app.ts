import express from 'express';
import config from 'config';
import logger from './utils/logger';
import cors from 'cors';
import banksRouter from './routes/banks.routes';
import printersRouter from './routes/printers.routes';
import shiftsRouter from './routes/shifts.routes';
import usersRouter from './routes/users.routes';
import errorHandler from './middlewares/errorHandler';
import 'express-async-errors';

const port = config.get<number>('dev.port');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/banks', banksRouter);
app.use('/api/printers', printersRouter);
app.use('/api/shifts', shiftsRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Listening on localhost:${port}`);
});

// git test
