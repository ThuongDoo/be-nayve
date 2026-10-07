import express, { Router } from 'express';
import cors from 'cors';
import { submitForm } from '../controllers/forms.controller.js';

/**
 * Forms on published pages post here from their own domains, so any origin is allowed (app.js mounts
 * this before the app-wide CORS setting). The body comes as text/plain to avoid a preflight.
 */
const router = Router();

router.use(cors({ origin: '*', methods: ['POST'] }));
router.post('/submit', express.text({ type: '*/*', limit: '32kb' }), submitForm);

export default router;
