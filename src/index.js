import express, { json } from 'express';
import cors from 'cors';
import routes from './routes/routes.js'
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());
app.use(cors());
app.use(routes);

app.listen(process.env.PORT, () => {
    console.log('Servidor online na porta ' + process.env.PORT);
});