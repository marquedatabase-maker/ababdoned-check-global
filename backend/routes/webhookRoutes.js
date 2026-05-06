import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Define routes explicitly without any optional parameters to avoid Express 5 errors
router.post('/test', (req, res) => res.send('Webhook route is working!'));
router.post('/', handleWebhook);
router.post('/:store_id', handleWebhook);

export default router;
