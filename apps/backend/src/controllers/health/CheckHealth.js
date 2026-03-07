import pool from '../../config/mysql.js';
import fs from 'fs/promises';

export default async function CheckHealth(req, res) {
  const status = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      database: 'DOWN',
      storage: 'DOWN',
    },
  };

  try {
    const [result] = await pool.query('SELECT 1;');
    if (result) status.services.database = 'UP';

    await fs.access('/data/sounds', fs.constants.W_OK);
    status.services.storage = 'UP';

    const isHealthy = status.services.database === 'UP' && status.services.storage === 'UP';

    return res.status(isHealthy ? 200 : 503).json(status);
  } catch (error) {
    status.message = error.message;
    return res.status(503).json(status);
  }
}
