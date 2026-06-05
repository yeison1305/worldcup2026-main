const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FIFA World Cup 2026 Predictor API',
      version: '1.0.0',
      description: 'API REST para predicciones del Mundial 2026 con LLM (DeepSeek). Incluye gestión de equipos, partidos, resultados, tabla de posiciones, predicciones IA, simulación en vivo, auditoría y notificaciones.',
      contact: {
        name: 'World Cup 2026 Team',
      },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor de desarrollo' },
    ],
    tags: [
      { name: 'Auth', description: 'Autenticación y gestión de usuarios' },
      { name: 'Teams', description: 'Equipos del torneo' },
      { name: 'Matches', description: 'Partidos, resultados y simulación en vivo' },
      { name: 'Standings', description: 'Tabla de posiciones por grupo' },
      { name: 'Predictions', description: 'Predicciones IA con DeepSeek' },
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
        Success: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: { type: 'object' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Error description' },
          },
        },
        Team: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            group_letter: { type: 'string' },
            flag_url: { type: 'string' },
            is_active: { type: 'boolean' },
          },
        },
        Match: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            home_team: { $ref: '#/components/schemas/Team' },
            away_team: { $ref: '#/components/schemas/Team' },
            home_score: { type: 'integer', nullable: true },
            away_score: { type: 'integer', nullable: true },
            phase: { type: 'string' },
            group_letter: { type: 'string' },
            round_number: { type: 'integer' },
            match_date: { type: 'string', format: 'date-time' },
            stadium: { type: 'string' },
            location: { type: 'string' },
            status: { type: 'string', enum: ['SCHEDULED', 'LIVE', 'FINISHED'] },
          },
        },
        Prediction: {
          type: 'object',
          properties: {
            predicted_winner: { type: 'string' },
            confidence: { type: 'number' },
            home_win_probability: { type: 'number' },
            draw_probability: { type: 'number' },
            away_win_probability: { type: 'number' },
            reasoning: { type: 'string' },
            model_version: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AuditLog: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            action: { type: 'string' },
            entity_type: { type: 'string' },
            entity_id: { type: 'integer' },
            details: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
