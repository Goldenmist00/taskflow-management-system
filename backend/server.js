const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A comprehensive task management system with user authentication and role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@taskmanagement.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Task ID'
            },
            title: {
              type: 'string',
              description: 'Task title'
            },
            description: {
              type: 'string',
              description: 'Task description'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed'],
              description: 'Task status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Task priority level'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date'
            },
            createdBy: {
              $ref: '#/components/schemas/User'
            },
            assignedTo: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and user management endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Task Management API Documentation'
}));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the server is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server is running!
 */
app.get('/api/v1/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });