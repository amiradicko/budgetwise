// Types pour le système d'insights et IA financière

export interface InsightData {
  predictions: Prediction[];
  anomalies: Anomaly[];
  recommendations: Recommendation[];
  trends: CategoryTrend[];
  spendingPatterns: SpendingPattern[];
  budgetHealth: BudgetHealth;
}

export interface Prediction {
  id: string;
  type: 'MONTH_END_SPENDING' | 'BUDGET_OVERRUN' | 'SAVINGS_FORECAST';
  title: string;
  description: string;
  predictedAmount: number;
  confidence: number; // 0-100
  category?: string;
  severity: 'info' | 'warning' | 'danger';
  icon: string;
}

export interface Anomaly {
  id: string;
  type: 'UNUSUAL_SPENDING' | 'DUPLICATE_TRANSACTION' | 'CATEGORY_SPIKE';
  title: string;
  description: string;
  transactionId?: string;
  categoryId?: string;
  amount: number;
  averageAmount: number;
  deviationPercent: number;
  date: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  id: string;
  type: 'SAVE_MORE' | 'REDUCE_SPENDING' | 'OPTIMIZE_BUDGET' | 'ADJUST_GOAL' | 'RECURRING_EXPENSE';
  title: string;
  description: string;
  potentialSavings?: number;
  categoryId?: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  icon: string;
}

export interface CategoryTrend {
  categoryId: string;
  categoryName: string;
  currentMonthSpending: number;
  lastMonthSpending: number;
  averageMonthlySpending: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
  color: string;
}

export interface SpendingPattern {
  pattern: string; // ex: "Vous dépensez plus les weekends"
  description: string;
  impact: number; // Montant concerné
  frequency: string; // "hebdomadaire", "mensuel"
}

export interface BudgetHealth {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  message: string;
  budgetsOnTrack: number;
  budgetsOverBudget: number;
  totalBudgets: number;
  savingsRate: number; // Pourcentage
}

export interface InsightsFilters {
  month?: number;
  year?: number;
  includePredictions?: boolean;
  includeAnomalies?: boolean;
  includeRecommendations?: boolean;
  includeTrends?: boolean;
}
