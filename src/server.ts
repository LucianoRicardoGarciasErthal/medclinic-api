import 'express-async-errors';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { adminRouter } from './routes/adminRoutes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter);

app.use(errorMiddleware);

const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    console.log('Banco conectado e migrations executadas');

    app.listen(PORT, () => {
      console.log(`MedClinic API rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar aplicacao:', error);
    process.exit(1);
  }
}

bootstrap();