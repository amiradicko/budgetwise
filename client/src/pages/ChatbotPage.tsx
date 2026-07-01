import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatbotService from '../services/chatbot.service';
import type { ChatMessage } from '@budgetwise/shared';
import { Send, Bot, User, Trash2, MessageSquare } from 'lucide-react';
import { Card } from '../components/ui/Card';

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Charger les conversations
  const { data: conversationsData } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatbotService.getConversations(),
  });

  // Charger la conversation actuelle
  const { data: currentConversation } = useQuery({
    queryKey: ['conversation', currentConversationId],
    queryFn: () => chatbotService.getConversation(currentConversationId!),
    enabled: !!currentConversationId,
  });

  // Mettre à jour les messages quand la conversation change
  useEffect(() => {
    if (currentConversation?.messages) {
      setMessages(currentConversation.messages);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: (msg: string) =>
      chatbotService.sendMessage({
        message: msg,
        conversationId: currentConversationId,
      }),
    onSuccess: (data) => {
      // Ajouter les messages à la liste
      setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
      
      // Mettre à jour l'ID de conversation
      if (!currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }
      
      // Invalider le cache des conversations
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', data.conversationId] });
      
      // Réinitialiser le champ de saisie
      setMessage('');
    },
  });

  // Mutation pour supprimer une conversation
  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => chatbotService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (currentConversationId) {
        setCurrentConversationId(undefined);
        setMessages([]);
      }
    },
  });

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(undefined);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette conversation ?')) {
      deleteConversationMutation.mutate(id);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6 p-6">
      {/* Sidebar - Liste des conversations */}
      <div className="w-80 flex flex-col gap-4">
        <button
          onClick={handleNewConversation}
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Nouvelle conversation
        </button>

        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-lg text-gray-900">Historique</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversationsData?.conversations && conversationsData.conversations.length > 0 ? (
              <div className="p-2 space-y-2">
                {conversationsData.conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group p-3 rounded-lg cursor-pointer transition-all ${
                      currentConversationId === conv.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{conv.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(conv.updatedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Aucune conversation
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Zone de chat principale */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assistant IA BudgetWise</h1>
              <p className="text-sm text-gray-600">Posez-moi des questions sur vos finances</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-20 h-20 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Bonjour ! Comment puis-je vous aider ?
              </h3>
              <p className="text-gray-600 max-w-md mb-6">
                Je peux vous aider à gérer vos finances, ajouter des transactions, consulter vos budgets
                et bien plus encore !
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-2xl">
                <button
                  onClick={() => setMessage("J'ai dépensé 5000 XOF au restaurant")}
                  className="p-3 bg-white rounded-xl shadow hover:shadow-md transition-all text-left border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900">💸 Ajouter une dépense</p>
                  <p className="text-xs text-gray-500 mt-1">
                    "J'ai dépensé 5000 XOF au restaurant"
                  </p>
                </button>
                <button
                  onClick={() => setMessage('Combien j\'ai dépensé ce mois ?')}
                  className="p-3 bg-white rounded-xl shadow hover:shadow-md transition-all text-left border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900">📊 Consulter mes dépenses</p>
                  <p className="text-xs text-gray-500 mt-1">"Combien j'ai dépensé ce mois ?"</p>
                </button>
                <button
                  onClick={() => setMessage('Quel est mon solde ?')}
                  className="p-3 bg-white rounded-xl shadow hover:shadow-md transition-all text-left border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900">💰 Voir mon solde</p>
                  <p className="text-xs text-gray-500 mt-1">"Quel est mon solde ?"</p>
                </button>
                <button
                  onClick={() => setMessage('Donne-moi des conseils')}
                  className="p-3 bg-white rounded-xl shadow hover:shadow-md transition-all text-left border border-gray-200"
                >
                  <p className="text-sm font-medium text-gray-900">💡 Obtenir des conseils</p>
                  <p className="text-xs text-gray-500 mt-1">"Donne-moi des conseils"</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                >
                  {msg.role === 'ASSISTANT' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-md ${
                      msg.role === 'USER'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {msg.role === 'USER' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={sendMessageMutation.isPending}
            />
            <button
              type="submit"
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sendMessageMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Envoyer
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChatbotPage;
