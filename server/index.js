import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import patientsRouter from './routes/patients.js';
import clinicianRouter from './routes/clinician.js';
import analyticsRouter from './routes/analytics.js';
import facilityRouter from './routes/facility.js';
import aiRouter from './routes/ai.js';
import remindersRouter from './routes/reminders.js';
import bloodRouter from './routes/blood.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TriageAssist Healthcare Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/patients', patientsRouter);
app.use('/api/clinician', clinicianRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/facility', facilityRouter);
app.use('/api/facilities', facilityRouter);
app.use('/api/ai', aiRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/blood', bloodRouter);

app.listen(PORT, () => {
  console.log(`[TriageAssist Server] Running on http://localhost:${PORT}`);
});
