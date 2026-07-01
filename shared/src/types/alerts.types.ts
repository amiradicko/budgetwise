// Smart Alerts Types

export interface SmartAlert {
  id: string;
  userId: string;
  type: 'BUDGET_WARNING' | 'BUDGET_EXCEEDED' | 'UNUSUAL_SPENDING' | 'SAVING_OPPORTUNITY' | 'GOAL_PROGRESS' | 'BILL_DUE';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export interface AlertRule {
  id: string;
  type: SmartAlert['type'];
  isEnabled: boolean;
  conditions: Record<string, any>;
}

export interface CreateAlertRequest {
  type: SmartAlert['type'];
  severity: SmartAlert['severity'];
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

// Bill Splitting Types

export interface BillSplit {
  id: string;
  userId: string; // Créateur
  title: string;
  description?: string;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  participants: BillParticipant[];
  payments: BillPayment[];
}

export interface BillParticipant {
  id: string;
  billSplitId: string;
  name: string;
  email?: string;
  phone?: string;
  shareAmount: number;
  isPaid: boolean;
  paidAt?: Date;
}

export interface BillPayment {
  id: string;
  billSplitId: string;
  participantId: string;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  paidAt: Date;
  notes?: string;
}

export interface CreateBillSplitRequest {
  title: string;
  description?: string;
  totalAmount: number;
  participants: {
    name: string;
    email?: string;
    phone?: string;
    shareAmount: number;
  }[];
}

export interface UpdateBillSplitRequest {
  title?: string;
  description?: string;
  status?: BillSplit['status'];
}

export interface RecordPaymentRequest {
  participantId: string;
  amount: number;
  paymentMethod?: string;
  notes?: string;
}

export interface BillSplitListResponse {
  billSplits: BillSplit[];
  total: number;
}
