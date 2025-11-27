import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorMiddleware, AppError } from './middlewares/error.middleware';
import routes from './routes';
import logger from './utils/logger';

// Initialize Express app
const app: Express = express();

// Trust proxy
app.set('trust proxy', 1);

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
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

app.use('/api', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api', routes);

// Swagger documentation setup
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
            url: `http://localhost:${config.port}`,
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
      apis: [path.join(__dirname, './routes/*.ts'), path.join(__dirname, './controllers/*.ts')],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'AcadFlow API Documentation',
    }));

    logger.info(`📚 Swagger documentation available at http://localhost:${config.port}/api-docs`);
  } catch (error) {
    logger.warn('Swagger setup failed, continuing without documentation', { error });
  }
}

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler (must be last)
app.use(errorMiddleware);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
  logger.info(`📡 API available at http://localhost:${PORT}/api`);
  if (config.nodeEnv !== 'production') {
    logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;

