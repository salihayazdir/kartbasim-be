import express from 'express';
import config from 'config';
import logger from './utils/logger';
import cors from 'cors';
import deserializeUser from './middlewares/deserializeUser';
import errorHandler from './middlewares/errorHandler';
require('dotenv').config();
import 'express-async-errors';

import banksRouter from './routes/banks.routes';
import printersRouter from './routes/printers.routes';
import productGroupsRouter from './routes/product-groups.routes';
import productTypesRouter from './routes/product-types.routes';
import productsRouter from './routes/products.routes';
import consumableTypesRouter from './routes/consumable-types.routes';
import consumablesRouter from './routes/consumables.routes';
import usersRouter from './routes/users.routes';
import authRouter from './routes/auth.routes';

const port = config.get<number>('dev.port');
const app = express();

app.use(express.json());

var corsOptions = {
	origin: 'http://localhost:3000',
	optionsSuccessStatus: 200,
	credentials: true,
};

app.use(cors(corsOptions));

app.use(deserializeUser);

app.use('/api/auth', authRouter);
app.use('/api/banks', banksRouter);
app.use('/api/printers', printersRouter);
app.use('/api/product-groups', productGroupsRouter);
app.use('/api/product-types', productTypesRouter);
app.use('/api/products', productsRouter);
app.use('/api/consumable-types', consumableTypesRouter);
app.use('/api/consumables', consumablesRouter);
app.use('/api/users', usersRouter);

app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Listening on localhost:${port}`);
	console.log(process.env.NODE_ENV?.trim());
});
