import { Router } from 'express';
import { getKeywords, getRecommendations, listCustomers } from '../controllers/keywordController';

const router = Router();

router.post('/keywords', getKeywords);
router.post('/recommendations', getRecommendations);
router.get('/customers', listCustomers);

export default router;