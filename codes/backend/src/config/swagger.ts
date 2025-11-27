import { SwaggerDefinition } from 'swagger-jsdoc';

export const swaggerDefinition: SwaggerDefinition = {
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
      url: 'http://localhost:3000',
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
    schemas: {
      // Common schemas can be defined here
      ApiError: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message description',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174001',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'student1@acadflow.edu',
          },
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          role: {
            type: 'string',
            enum: ['STUDENT', 'SUPERVISOR', 'EXAMINER', 'HOD', 'DEAN', 'STUDENT_AFFAIRS', 'ACCOUNTS', 'ADMIN'],
            example: 'STUDENT',
          },
          studentId: {
            type: 'string',
            nullable: true,
            example: 'STU0001',
          },
          department: {
            type: 'string',
            nullable: true,
            example: 'Computer Science',
          },
        },
      },
      Notification: {
        type: 'object',
        required: ['id', 'userId', 'title', 'message', 'read', 'createdAt'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique identifier for the notification',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the user who owns the notification',
            example: '123e4567-e89b-12d3-a456-426614174001',
          },
          title: {
            type: 'string',
            description: 'Notification title',
            example: 'FYP Stage Updated',
          },
          message: {
            type: 'string',
            description: 'Notification message',
            example: 'Your FYP "AI-Powered Learning Management System" is now in PROPOSAL_APPROVED stage',
          },
          read: {
            type: 'boolean',
            description: 'Whether the notification has been read',
            example: false,
          },
          fypId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Associated FYP ID (if notification is FYP-related)',
            example: '123e4567-e89b-12d3-a456-426614174002',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when notification was created',
            example: '2024-01-20T10:30:00.000Z',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

