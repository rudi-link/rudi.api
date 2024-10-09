import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';
import cookieParser from 'cookie-parser';
import { AuthRouter } from './modules/auth/auth.router';
import { ApiRouter } from './modules/api/api.router';
import { VisiteRouter } from './modules/visite/visite.router';
import { LinkRouter } from './modules/link/link.router';

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

// CORS Middleware
const corsOptions = {
  origin: process.env.APP_ENV == 'developement' ? '*' : process.env.ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// JSON Middleware & Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// Main Routes
app.use('/auth', AuthRouter)
app.use('/api', ApiRouter)
app.use('/visite', VisiteRouter)
app.use('/', LinkRouter)

// Not Found Middleware
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
