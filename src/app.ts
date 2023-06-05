import express from 'express';
import config from 'config';
import logger from './utils/logger';
import cors from 'cors';
import banksRouter from './routes/banks.routes';
import printersRouter from './routes/printers.routes';
import shiftsRouter from './routes/shifts.routes';
import usersRouter from './routes/users.routes';
import authRouter from './routes/auth.routes';
import errorHandler from './middlewares/errorHandler';
import 'express-async-errors';
import deserializeUser from './middlewares/deserializeUser';
require('dotenv').config();

const port = config.get<number>('dev.port');
const app = express();

app.use(express.json());

var corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	credentials: true,
};

app.use(cors(corsOptions));

app.use(deserializeUser);

app.use('/api/auth', authRouter);
app.use('/api/banks', banksRouter);
app.use('/api/printers', printersRouter);
app.use('/api/shifts', shiftsRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Listening on localhost:${port}`);
	console.log(process.env.NODE_ENV?.trim());
});
