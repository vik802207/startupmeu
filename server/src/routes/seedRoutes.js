import express from 'express';
import { seedDatabase } from '../seed/seeder.js';

const router = express.Router();

router.post('/reset', async (req, res, next) => {
  try {
    const result = await seedDatabase();
    res.json({
      success: true,
      message: 'Database reset to initial demo state successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
