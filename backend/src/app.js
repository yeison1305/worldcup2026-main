const express = require('express');
const cors = require('cors');
require('./config/env');
const { allowedOrigins } = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');
const matchRoutes = require('./routes/match.routes');
const standingsRoutes = require('./routes/standings.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// CORS configurado con whitelist
// Solo permite origins específicos + requests sin origin (Postman, curl)
const corsOptions = {
  origin: (origin, callback) => {
    // Requests sin origin (Postman, servidores, etc) siempre permitidos
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Origin no permitido -拒絕
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200, // Para compatibilidad con algunos browsers legacy
};

// Middleware CORS
app.use(cors(corsOptions));

// Manejar errores de CORS específicamente
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      status: 'fail',
      message: 'Origin not allowed'
    });
  }
  next(err);
});

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/standings', standingsRoutes);

// Ruta de salud para verificar que el servidor corre
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' });
});

// Middleware de errores — siempre al final
app.use(errorMiddleware);

const { port } = require('./config/env');
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
