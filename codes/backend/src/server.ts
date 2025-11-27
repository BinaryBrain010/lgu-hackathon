import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorMiddleware, AppError } from './middlewares/error.middleware';
import routes from './routes';
import logger from './utils/logger';

export class App {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Trust proxy
    this.app.set('trust proxy', 1);

    // CORS configuration
    this.app.use(
      cors({
        origin: config.corsOrigin,
        credentials: true,
      })
    );

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // HTTP request logging
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(
        morgan('combined', {
          stream: {
            write: (message: string) => logger.info(message.trim()),
          },
        })
      );
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });

    this.app.use('/api', limiter);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
      });
    });

    // API routes
    this.app.use('/api/v1', routes);
  }

  private initializeSwagger(): void {
    if (config.nodeEnv !== 'production') {
      try {
        const swaggerUi = require('swagger-ui-express');
        const swaggerJsdoc = require('swagger-jsdoc');
        const path = require('path');

        const swaggerOptions = {
          definition: {
            openapi: '3.0.0',
            info: {
              title: 'AcadFlow API',
              version: '1.0.0',
              description: 'FYP & Degree Workflow Automation Portal API Documentation',
              contact: {
                name: 'AcadFlow Team',
              },
            },
            servers: [
              {
                url: `http://localhost:${this.port}`,
                description: 'Development server',
              },
            ],
            components: {
              securitySchemes: {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
              },
            },
            security: [
              {
                bearerAuth: [],
              },
            ],
          },
          apis: [path.join(__dirname, './modules/**/route/*.ts'), path.join(__dirname, './modules/**/controller/*.ts')],
        };

        const swaggerSpec = swaggerJsdoc(swaggerOptions);
        
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
          explorer: true,
          customCss: '.swagger-ui .topbar { display: none }',
          customSiteTitle: 'AcadFlow API Documentation',
        }));

        logger.info(`📚 Swagger documentation available at http://localhost:${this.port}/api-docs`);
      } catch (error) {
        logger.warn('Swagger setup failed, continuing without documentation', { error });
      }
    }
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError(`Route ${req.originalUrl} not found`, 404));
    });

    // Global error handler (must be last)
    this.app.use(errorMiddleware);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`🚀 Server running on port ${this.port}`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
      logger.info(`📡 API available at http://localhost:${this.port}/api/v1`);
      if (config.nodeEnv !== 'production') {
        logger.info(`📚 API Documentation: http://localhost:${this.port}/api-docs`);
      }
    });
  }

  public getApp(): Express {
    return this.app;
  }

  public setupGracefulShutdown(): void {
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      process.exit(0);
    });
  }
}

// Create and start the application
const app = new App();
app.listen();
app.setupGracefulShutdown();

export default app.getApp();
