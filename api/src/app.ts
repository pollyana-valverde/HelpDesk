import express from 'express';
import cors from 'cors';

import { routes } from './routes/index.js';
import { errorHandling } from './middlewares/error-handling.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);
app.use(errorHandling);

export { app };