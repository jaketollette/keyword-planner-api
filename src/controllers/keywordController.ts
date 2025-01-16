import { Request, Response } from 'express';
import { getKeywordPlans, getCustomers } from '../services/keywordPlanner';
import { KeywordPlanRequestDTO } from '../services/keywordPlanner';

export const getKeywords = async (req: Request, res: Response) => {
  try {
    const request: KeywordPlanRequestDTO = req.body;
    const results = await getKeywordPlans(request);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch keywords' });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const request: KeywordPlanRequestDTO = req.body;
    console.log('Fetching recommendations', req.body);
    const results = await getKeywordPlans(request);
    res.json(results);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const listCustomers = async (_req: Request, res: Response) => {
  try {
    console.log('Fetching customers');
    const customers = await getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};