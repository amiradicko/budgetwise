import api from '../lib/api';
import type { SendMessageRequest, SendMessageResponse, ConversationListResponse, Conversation } from '@budgetwise/shared';

class ChatbotService {
  /**
   * Envoyer un message au chatbot
   */
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await api.post('/chatbot/message', data);
    return response.data;
  }

  /**
   * Obtenir toutes les conversations
   */
  async getConversations(): Promise<ConversationListResponse> {
    const response = await api.get('/chatbot/conversations');
    return response.data;
  }

  /**
   * Obtenir une conversation spécifique
   */
  async getConversation(id: string): Promise<Conversation> {
    const response = await api.get(`/chatbot/conversations/${id}`);
    return response.data;
  }

  /**
   * Supprimer une conversation
   */
  async deleteConversation(id: string): Promise<void> {
    await api.delete(`/chatbot/conversations/${id}`);
  }
}

export default new ChatbotService();
