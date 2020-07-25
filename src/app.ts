import express from 'express';
import mongoose from 'mongoose';

import helmet from 'helmet';
import cors from 'cors';
import bearerToken from 'express-bearer-token';
import { errorHandler } from './middlewares';

import router from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.connectMongoDB();
    this.initializeRouter();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      bearerToken({
        bodyKey: 'token',
        headerKey: 'Bearer',
      }),
    );
    this.app.use(errorHandler);
  }

  // eslint-disable-next-line class-methods-use-this
  private connectMongoDB() {
    const mongooseOption = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.connect(`mongodb://localhost:27017/dimigoin`, mongooseOption);
  }

  private initializeRouter() {
    this.app.use('/', router);
  }
}

export default App;
