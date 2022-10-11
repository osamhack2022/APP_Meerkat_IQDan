// core
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
// config
import { NODE_ENV, HTTP_PORT, HTTPS_PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, SSL_URL, KEY_NAME, SSL_NAME, CHAIN_NAME } from '@config';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import http from "http";
import https from "https";
import fs from "fs";
// route
import SocketIO from "./socket/socketio";

class App {
  public app: express.Application;
  public env: string;
  public socketIO: SocketIO;
  public http_port: string | number;
  public https_port: string | number;
  private credentials: Object;


  constructor(routes: Routes[]) {
    this.app = express();
    this.app.disable('etag');
    this.env = NODE_ENV || 'development';
    this.http_port = HTTP_PORT || 3000;
    this.https_port = HTTPS_PORT || 8443;

    this.initializeSSL();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public start() {
    // http server
    const httpServer = http.createServer(this.app);
    this.socketIO = new SocketIO(httpServer);
    httpServer.listen(this.http_port, () => {
      logger.info(`==================================`);
      logger.info(`======= ENV: ${this.env} =========`);
      logger.info(`🚀 HTTP listening on the port ${this.http_port}`);
      logger.info(`==================================`);
    });
  
    // https server
    const httpsServer = https.createServer(this.credentials, this.app);
    this.socketIO = new SocketIO(httpsServer);
    httpsServer.listen(this.https_port, () => {
      logger.info(`==================================`);
      logger.info(`======= ENV: ${this.env} =========`);
      logger.info(`🚀 HTTPS listening on the port ${this.https_port}`);
      logger.info(`==================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeSSL(){
    this.credentials = {
      key: fs.readFileSync(`${SSL_URL}/${KEY_NAME}`),
      cert: fs.readFileSync(`${SSL_URL}/${SSL_NAME}`)
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;