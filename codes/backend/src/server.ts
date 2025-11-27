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

        // Get the correct base path - handle both compiled and source
        // When running with tsx, __dirname might point to a temp location
        // Try multiple path resolution strategies
        const fs = require('fs');
        
        let srcDir: string = path.resolve(__dirname, '..'); // Default fallback
        
        // Strategy 1: Try relative to current file location
        const relativeSrc = path.resolve(__dirname, '..');
        if (fs.existsSync(path.join(relativeSrc, 'modules'))) {
          srcDir = relativeSrc;
        }
        // Strategy 2: Try from project root (process.cwd())
        else {
          const projectRoot = process.cwd();
          const projectSrc = path.join(projectRoot, 'src');
          if (fs.existsSync(path.join(projectSrc, 'modules'))) {
            srcDir = projectSrc;
          }
        }
        
        logger.info(`Swagger scanning from: ${srcDir}`);
        
        // Use glob patterns - swagger-jsdoc can read TypeScript files
        const apiPaths = [
          `${srcDir}/modules/**/route/*.ts`,
          `${srcDir}/modules/**/route/*.js`,
          `${srcDir}/modules/**/controller/*.ts`,
          `${srcDir}/modules/**/controller/*.js`,
        ];

        // Import swagger definition
        const { swaggerDefinition: baseDefinition } = require('./config/swagger');
        
        // Update server URL dynamically
        const swaggerDefinition = {
          ...baseDefinition,
          servers: [
            {
              url: `http://localhost:${this.port}`,
              description: 'Development server',
            },
          ],
        };

        const swaggerOptions = {
          definition: swaggerDefinition,
          apis: apiPaths,
        };

        const swaggerSpec = swaggerJsdoc(swaggerOptions);
        
        // Debug logging
        if (swaggerSpec.paths) {
          const pathCount = Object.keys(swaggerSpec.paths).length;
          logger.info(`✅ Swagger spec generated successfully with ${pathCount} API paths`);
        } else {
          logger.warn('⚠️  Swagger spec generated but no paths found. Check file paths.');
          logger.debug('Swagger search paths:', apiPaths);
        }
        
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
          explorer: true,
          customCss: '.swagger-ui .topbar { display: none }',
          customSiteTitle: 'AcadFlow API Documentation',
        }));

        // Add endpoint to view raw Swagger spec for debugging
        this.app.get('/api-docs.json', (req: Request, res: Response) => {
          res.setHeader('Content-Type', 'application/json');
          res.send(swaggerSpec);
        });

        logger.info(`📚 Swagger documentation available at http://localhost:${this.port}/api-docs`);
        logger.info(`📄 Swagger JSON spec available at http://localhost:${this.port}/api-docs.json`);
      } catch (error: any) {
        logger.error('❌ Swagger setup failed, continuing without documentation', { 
          error: error.message,
          stack: config.nodeEnv === 'development' ? error.stack : undefined
        });
      }
    } else {
      logger.info('Swagger documentation is disabled in production mode');
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
