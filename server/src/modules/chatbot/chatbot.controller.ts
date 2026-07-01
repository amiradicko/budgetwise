import { Response } from 'express';
import chatbotService from './chatbot.service';
import type { AuthRequest } from '../../middlewares/auth';

export class ChatbotController {
  /**
   * Envoyer un message au chatbot
   */
  async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { message, conversationId } = req.body;
      const userId = req.user!.userId;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message requis' });
      }

      const result = await chatbotService.processMessage(userId, message, conversationId);

      return res.json(result);
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtenir l'historique d'une conversation
   */
  async getConversation(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID requis' });
      }

      const conversation = await chatbotService.getConversationHistory(id);

      if (!conversation) {
        return res.status(404).json({ error: 'Conversation non trouvée' });
      }

      // Vérifier que la conversation appartient à l'utilisateur
      if (conversation.userId !== req.user!.userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      return res.json(conversation);
    } catch (error: any) {
      console.error('Error in getConversation:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtenir toutes les conversations de l'utilisateur
   */
  async getConversations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      const conversations = await chatbotService.getUserConversations(userId);

      return res.json({
        conversations,
        total: conversations.length,
      });
    } catch (error: any) {
      console.error('Error in getConversations:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Supprimer une conversation
   */
  async deleteConversation(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      if (!id) {
        return res.status(400).json({ error: 'ID requis' });
      }

      await chatbotService.deleteConversation(id, userId);

      return res.json({ message: 'Conversation supprimée' });
    } catch (error: any) {
      console.error('Error in deleteConversation:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new ChatbotController();
