import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import config from './config';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import logger from './utils/logger';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import accountsRoutes from './modules/accounts/accounts.routes';
import transactionsRoutes from './modules/transactions/transactions.routes';
import budgetsRoutes from './modules/budgets/budgets.routes';
import goalsRoutes from './modules/goals/goals.routes';
import categoriesRoutes from './modules/categories/categories.routes';
import achievementsRoutes from './modules/achievements/achievements.routes';
import tontinesRoutes from './modules/tontines/tontines.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import insightsRoutes from './modules/insights/insights.routes';
import chatbotRoutes from './modules/chatbot/chatbot.routes';
import smartAlertsRoutes from './modules/smartAlerts/smartAlerts.routes';
import billSplitRoutes from './modules/billSplit/billSplit.routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());
    
    // CORS - Allow all localhost ports in development
    this.app.use(
      cors({
        origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
          
          // In development, allow all localhost origins
          if (config.env === 'development' && origin.startsWith('http://localhost:')) {
            return callback(null, true);
          }
          
          // In production, check against whitelist
          if (origin === config.cors.origin) {
            return callback(null, true);
          }
          
          callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // Request logging
    if (config.env === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      }));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Static files
    this.app.use('/uploads', express.static(config.upload.uploadDir));
  }

  private configureRoutes(): void {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    const apiPrefix = '/api/v1';
    
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/users`, usersRoutes);
    this.app.use(`${apiPrefix}/accounts`, accountsRoutes);
    this.app.use(`${apiPrefix}/transactions`, transactionsRoutes);
    this.app.use(`${apiPrefix}/budgets`, budgetsRoutes);
    this.app.use(`${apiPrefix}/goals`, goalsRoutes);
    this.app.use(`${apiPrefix}/categories`, categoriesRoutes);
    this.app.use(`${apiPrefix}/achievements`, achievementsRoutes);
    this.app.use(`${apiPrefix}/tontines`, tontinesRoutes);
    this.app.use(`${apiPrefix}/notifications`, notificationsRoutes);
    this.app.use(`${apiPrefix}/insights`, insightsRoutes);
    this.app.use(`${apiPrefix}/chatbot`, chatbotRoutes);
    this.app.use(`${apiPrefix}/smart-alerts`, smartAlertsRoutes);
    this.app.use(`${apiPrefix}/bill-splits`, billSplitRoutes);
  }

  private configureErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }
}

export default new App().app;
