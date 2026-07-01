import prisma from '../../config/database';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, startOfYear, endOfYear } from 'date-fns';

export interface Intent {
  type: string;
  confidence: number;
  entities: Record<string, any>;
}

export class ChatbotService {
  /**
   * Analyser l'intention du message utilisateur
   */
  analyzeIntent(message: string): Intent {
    const lowerMessage = message.toLowerCase().trim();

    // Détection d'ajout de transaction
    const addTransactionPatterns = [
      /(?:j'ai|je viens de|j'ai|ai)\s+(?:dépensé|payé|acheté|mis)\s+(\d+)\s*(?:xof|fcfa|francs?|€|euros?)?\s+(?:pour|en|au|à|chez)?\s*(.+)/i,
      /(?:dépense|achat|paiement)\s+(?:de\s+)?(\d+)\s*(?:xof|fcfa|francs?|€|euros?)?\s+(?:pour|en|au|à)?\s*(.+)/i,
      /(\d+)\s*(?:xof|fcfa|francs?|€|euros?)\s+(?:pour|en|au|à|dépensé|payé)?\s*(.+)/i,
    ];

    for (const pattern of addTransactionPatterns) {
      const match = lowerMessage.match(pattern);
      if (match && match[1]) {
        const amount = parseInt(match[1]);
        const description = match[2]?.trim();
        
        return {
          type: 'ADD_TRANSACTION',
          confidence: 0.9,
          entities: {
            amount,
            description,
            type: 'EXPENSE',
            date: new Date().toISOString(),
          },
        };
      }
    }

    // Détection de revenu
    const incomePatterns = [
      /(?:j'ai|je viens de)\s+(?:reçu|gagné|touché)\s+(\d+)\s*(?:xof|fcfa|francs?|€|euros?)?\s+(?:de|pour)?\s*(.+)/i,
      /(?:revenu|salaire|gain)\s+(?:de\s+)?(\d+)\s*(?:xof|fcfa|francs?|€|euros?)?\s*(.+)?/i,
    ];

    for (const pattern of incomePatterns) {
      const match = lowerMessage.match(pattern);
      if (match && match[1]) {
        return {
          type: 'ADD_TRANSACTION',
          confidence: 0.85,
          entities: {
            amount: parseInt(match[1]),
            description: match[2]?.trim() || 'Revenu',
            type: 'INCOME',
            date: new Date().toISOString(),
          },
        };
      }
    }

    // Détection de consultation de transactions
    const viewTransactionPatterns = [
      /(?:combien|quel|quelles?)\s+(?:j'ai|sont mes)\s+(?:dépenses?|dépensé|transactions?)\s+(?:en|pour|au|du|de|ce|cette)?\s*(alimentation|transport|santé|loisirs|logement|éducation)?/i,
      /(?:voir|afficher|montre|montrer)\s+(?:mes\s+)?(?:dépenses?|transactions?)\s+(?:en|pour|du|de|ce|cette)?\s*(alimentation|transport|santé|loisirs|logement|éducation)?/i,
      /(?:dépenses?|transactions?)\s+(?:en|pour|du|de)\s+(alimentation|transport|santé|loisirs|logement|éducation)/i,
    ];

    for (const pattern of viewTransactionPatterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        const category = match[1]?.trim();
        
        // Déterminer la période
        let period: 'day' | 'week' | 'month' | 'year' = 'month';
        if (lowerMessage.includes('aujourd\'hui') || lowerMessage.includes('jour')) period = 'day';
        if (lowerMessage.includes('semaine')) period = 'week';
        if (lowerMessage.includes('mois')) period = 'month';
        if (lowerMessage.includes('année') || lowerMessage.includes('an')) period = 'year';

        return {
          type: 'VIEW_TRANSACTIONS',
          confidence: 0.85,
          entities: {
            category,
            period,
          },
        };
      }
    }

    // Détection de consultation de solde
    if (
      lowerMessage.includes('solde') ||
      lowerMessage.includes('combien j\'ai') ||
      lowerMessage.includes('combien il me reste') ||
      lowerMessage.includes('mon compte')
    ) {
      return {
        type: 'VIEW_BALANCE',
        confidence: 0.9,
        entities: {},
      };
    }

    // Détection de consultation de budgets
    if (
      lowerMessage.includes('budget') ||
      lowerMessage.includes('combien je peux dépenser')
    ) {
      return {
        type: 'VIEW_BUDGETS',
        confidence: 0.85,
        entities: {},
      };
    }

    // Détection de demande de conseils
    if (
      lowerMessage.includes('conseil') ||
      lowerMessage.includes('recommandation') ||
      lowerMessage.includes('aide') ||
      lowerMessage.includes('comment') ||
      lowerMessage.includes('devrais')
    ) {
      return {
        type: 'GET_ADVICE',
        confidence: 0.7,
        entities: {},
      };
    }

    // Question générale
    if (lowerMessage.includes('?')) {
      return {
        type: 'GENERAL_QUESTION',
        confidence: 0.6,
        entities: {},
      };
    }

    // Intention inconnue
    return {
      type: 'UNKNOWN',
      confidence: 0.3,
      entities: {},
    };
  }

  /**
   * Détecter la catégorie à partir du texte
   */
  async detectCategory(description: string, userId: string): Promise<string | undefined> {
    const lowerDesc = description.toLowerCase();

    // Récupérer les catégories de l'utilisateur
    const categories = await prisma.category.findMany({
      where: { userId },
    });

    // Mots-clés par catégorie commune
    const categoryKeywords: Record<string, string[]> = {
      'Alimentation': ['restaurant', 'nourriture', 'repas', 'café', 'supermarché', 'courses', 'manger', 'bouffe', 'resto', 'pizz', 'burger'],
      'Transport': ['taxi', 'bus', 'train', 'essence', 'carburant', 'transport', 'uber', 'métro', 'voiture', 'parking'],
      'Santé': ['médecin', 'pharmacie', 'docteur', 'hôpital', 'santé', 'médicament', 'consultation', 'soin'],
      'Loisirs': ['cinéma', 'concert', 'sport', 'loisir', 'jeu', 'hobby', 'divertissement', 'sortie', 'vacances'],
      'Logement': ['loyer', 'électricité', 'eau', 'gaz', 'internet', 'assurance', 'logement', 'maison', 'appartement'],
      'Éducation': ['école', 'université', 'cours', 'formation', 'livre', 'éducation', 'étude'],
      'Shopping': ['vêtement', 'chaussure', 'shopping', 'achat', 'magasin', 'boutique', 'mode'],
    };

    // Recherche dans les mots-clés
    for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          const category = categories.find(c => c.name === categoryName);
          if (category) return category.id;
        }
      }
    }

    // Catégorie par défaut
    const defaultCategory = categories.find(c => c.name === 'Autres' || c.name === 'Divers');
    return defaultCategory?.id;
  }

  /**
   * Créer une transaction à partir du message
   */
  async createTransactionFromMessage(userId: string, intent: Intent) {
    const { amount, description, type, date } = intent.entities;

    if (!amount || !description) {
      throw new Error('Montant ou description manquant');
    }

    // Obtenir le compte principal de l'utilisateur
    const account = await prisma.account.findFirst({
      where: { userId },
    });

    if (!account) {
      throw new Error('Aucun compte trouvé');
    }

    // Détecter la catégorie
    const categoryId = await this.detectCategory(description, userId);

    // Créer la transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        accountId: account.id,
        categoryId,
        type: type || 'EXPENSE',
        amount,
        description,
        date: date ? new Date(date) : new Date(),
        currency: 'XOF',
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Mettre à jour le solde du compte
    if (type === 'EXPENSE') {
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: { decrement: amount } },
      });
    } else {
      await prisma.account.update({
        where: { id: account.id },
        data: { balance: { increment: amount } },
      });
    }

    return transaction;
  }

  /**
   * Obtenir les transactions pour la période
   */
  async getTransactionsSummary(userId: string, period: 'day' | 'week' | 'month' | 'year', category?: string) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'day':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
    }

    const where: any = {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (category) {
      const categoryRecord = await prisma.category.findFirst({
        where: {
          userId,
          name: {
            contains: category,
            mode: 'insensitive',
          },
        },
      });

      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
      take: 10,
    });

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      transactions,
      totalExpenses,
      totalIncome,
      count: transactions.length,
      period,
      category,
    };
  }

  /**
   * Obtenir le solde total
   */
  async getBalance(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
    });

    const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

    return {
      totalBalance,
      accounts: accounts.map(a => ({
        id: a.id,
        name: a.name,
        balance: a.balance,
        type: a.type,
      })),
    };
  }

  /**
   * Obtenir les budgets
   */
  async getBudgets(userId: string) {
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(now);

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      include: {
        category: true,
      },
    });

    // Get transactions separately for each budget
    const budgetsWithStats = await Promise.all(budgets.map(async (budget) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          categoryId: budget.categoryId || undefined,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const spent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
      const budgetAmount = Number(budget.amount);
      const remaining = budgetAmount - spent;
      const percentage = (spent / budgetAmount) * 100;

      return {
        id: budget.id,
        category: budget.category?.name || 'Non catégorisé',
        amount: budgetAmount,
        spent,
        remaining,
        percentage,
        status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good',
      };
    }));

    return budgetsWithStats;
  }

  /**
   * Générer une réponse basée sur l'intention
   */
  async generateResponse(userId: string, intent: Intent): Promise<string> {
    try {
      switch (intent.type) {
        case 'ADD_TRANSACTION': {
          const transaction = await this.createTransactionFromMessage(userId, intent);
          const { amount, type } = intent.entities;
          const categoryName = 'Non catégorisé'; // Category name is not included in response
          
          if (type === 'INCOME') {
            return `✅ Super ! J'ai enregistré votre revenu de ${amount} XOF pour "${transaction.description}".\n\nVotre compte a été crédité.`;
          } else {
            return `✅ Transaction enregistrée !\n\n💰 Montant : ${amount} XOF\n📁 Catégorie : ${categoryName}\n📝 Description : ${transaction.description}\n\nVotre solde a été mis à jour.`;
          }
        }

        case 'VIEW_TRANSACTIONS': {
          const { period = 'month', category } = intent.entities;
          const summary = await this.getTransactionsSummary(userId, period, category);
          
          const periodText: Record<string, string> = {
            day: "aujourd'hui",
            week: 'cette semaine',
            month: 'ce mois',
            year: 'cette année',
          };
          const periodLabel = periodText[period] || 'cette période';

          const categoryText = category ? ` en ${category}` : '';
          
          if (summary.count === 0) {
            return `Vous n'avez aucune dépense${categoryText} ${periodText}. 🎉`;
          }

          let response = `📊 Voici vos dépenses${categoryText} ${periodLabel} :\n\n`;
          response += `💸 Total dépenses : ${Math.round(summary.totalExpenses)} XOF\n`;
          if (summary.totalIncome > 0) {
            response += `💰 Total revenus : ${Math.round(summary.totalIncome)} XOF\n`;
          }
          response += `\n📝 Dernières transactions :\n`;
          
          summary.transactions.slice(0, 5).forEach((t, i) => {
            const icon = t.type === 'EXPENSE' ? '💸' : '💰';
            const categoryName = t.category?.name || '';
            response += `${i + 1}. ${icon} ${Math.round(Number(t.amount))} XOF - ${t.description}${categoryName ? ` (${categoryName})` : ''}\n`;
          });

          return response;
        }

        case 'VIEW_BALANCE': {
          const balance = await this.getBalance(userId);
          
          let response = `💰 Voici votre situation financière :\n\n`;
          response += `🏦 Solde total : ${Math.round(balance.totalBalance)} XOF\n\n`;
          response += `Détail par compte :\n`;
          
          balance.accounts.forEach((account, i) => {
            response += `${i + 1}. ${account.name} : ${Math.round(Number(account.balance))} XOF\n`;
          });

          return response;
        }

        case 'VIEW_BUDGETS': {
          const budgets = await this.getBudgets(userId);
          
          if (budgets.length === 0) {
            return `Vous n'avez pas encore défini de budgets. 📊\n\nJe vous recommande de créer des budgets pour mieux contrôler vos dépenses !`;
          }

          let response = `📊 Voici l'état de vos budgets ce mois :\n\n`;
          
          budgets.forEach((budget, i) => {
            const statusIcon = budget.status === 'exceeded' ? '🔴' : budget.status === 'warning' ? '🟡' : '🟢';
            response += `${i + 1}. ${statusIcon} ${budget.category}\n`;
            response += `   Budget : ${Math.round(budget.amount)} XOF\n`;
            response += `   Dépensé : ${Math.round(budget.spent)} XOF (${Math.round(budget.percentage)}%)\n`;
            response += `   Reste : ${Math.round(budget.remaining)} XOF\n\n`;
          });

          return response;
        }

        case 'GET_ADVICE': {
          const budgets = await this.getBudgets(userId);
          const balance = await this.getBalance(userId);
          
          let advice = `💡 Voici mes conseils pour vous :\n\n`;
          
          // Analyse des budgets
          const exceededBudgets = budgets.filter(b => b.status === 'exceeded');
          const warningBudgets = budgets.filter(b => b.status === 'warning');
          
          if (exceededBudgets.length > 0) {
            advice += `⚠️ Attention ! Vous avez dépassé ${exceededBudgets.length} budget(s) :\n`;
            exceededBudgets.forEach(b => {
              advice += `   - ${b.category} : ${Math.round(b.percentage)}% utilisé\n`;
            });
            advice += `\nJe vous recommande de réduire vos dépenses dans ces catégories.\n\n`;
          }
          
          if (warningBudgets.length > 0) {
            advice += `🟡 Prudence : ${warningBudgets.length} budget(s) proche(s) de la limite :\n`;
            warningBudgets.forEach(b => {
              advice += `   - ${b.category} : ${Math.round(b.percentage)}% utilisé\n`;
            });
            advice += `\n`;
          }
          
          if (exceededBudgets.length === 0 && warningBudgets.length === 0 && budgets.length > 0) {
            advice += `✅ Excellent ! Tous vos budgets sont bien gérés.\n\n`;
          }
          
          // Conseil sur le solde
          if (balance.totalBalance < 0) {
            advice += `⚠️ Votre solde est négatif (${Math.round(balance.totalBalance)} XOF). Je vous recommande de faire attention à vos dépenses.\n`;
          } else if (balance.totalBalance < 50000) {
            advice += `💡 Votre solde est faible. Pensez à économiser pour les imprévus.\n`;
          }
          
          return advice;
        }

        case 'GENERAL_QUESTION':
        case 'UNKNOWN':
        default:
          return `Je suis votre assistant financier ! 🤖\n\nJe peux vous aider à :\n\n✅ Ajouter des transactions (ex: "J'ai dépensé 5000 XOF au restaurant")\n📊 Consulter vos dépenses (ex: "Combien j'ai dépensé ce mois ?")\n💰 Voir votre solde (ex: "Quel est mon solde ?")\n📈 Consulter vos budgets (ex: "Mes budgets")\n💡 Obtenir des conseils (ex: "Donne-moi des conseils")\n\nQue puis-je faire pour vous ?`;
      }
    } catch (error: any) {
      console.error('Error generating response:', error);
      return `❌ Désolé, une erreur s'est produite : ${error.message}\n\nPouvez-vous reformuler votre demande ?`;
    }
  }

  /**
   * Traiter un message et générer une réponse
   */
  async processMessage(userId: string, message: string, conversationId?: string) {
    // Créer ou récupérer la conversation
    let conversation;
    
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      // Générer un titre basé sur le message
      const title = message.length > 50 ? message.substring(0, 47) + '...' : message;
      
      conversation = await prisma.conversation.create({
        data: {
          userId,
          title,
        },
      });
    }

    // Analyser l'intention
    const intent = this.analyzeIntent(message);

    // Sauvegarder le message utilisateur
    const userMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: message,
        metadata: {
          intent: intent.type,
          confidence: intent.confidence,
        },
      },
    });

    // Générer la réponse
    const responseText = await this.generateResponse(userId, intent);

    // Sauvegarder la réponse de l'assistant
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: responseText,
        metadata: {
          intent: intent.type,
          entities: intent.entities,
        },
      },
    });

    return {
      conversationId: conversation.id,
      userMessage,
      assistantMessage,
    };
  }

  /**
   * Obtenir l'historique d'une conversation
   */
  async getConversationHistory(conversationId?: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return conversation;
  }

  /**
   * Obtenir toutes les conversations d'un utilisateur
   */
  async getUserConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations;
  }

  /**
   * Supprimer une conversation
   */
  async deleteConversation(conversationId: string, userId: string) {
    await prisma.conversation.delete({
      where: {
        id: conversationId,
        userId,
      },
    });
  }
}

export default new ChatbotService();
