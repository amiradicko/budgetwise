import { Router } from 'express';
import chatbotController from './chatbot.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

// POST /api/v1/chatbot/message - Envoyer un message
router.post('/message', chatbotController.sendMessage);

// GET /api/v1/chatbot/conversations - Obtenir toutes les conversations
router.get('/conversations', chatbotController.getConversations);

// GET /api/v1/chatbot/conversations/:id - Obtenir une conversation
router.get('/conversations/:id', chatbotController.getConversation);

// DELETE /api/v1/chatbot/conversations/:id - Supprimer une conversation
router.delete('/conversations/:id', chatbotController.deleteConversation);

export default router;
