import api from '../lib/api';

export interface Tontine {
  id: string;
  name: string;
  description?: string;
  totalMembers: number;
  contributionAmount: number;
  currency: string;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: string;
  endDate?: string;
  currentRound: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  rules?: string;
  nextPaymentDate: string;
  members?: TontineMember[];
  contributions?: any[];
  rotations?: any[];
  progress?: number;
  contributionsCount?: number;
  rotationsCount?: number;
}

export interface TontineMember {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  position: number;
  hasReceived: boolean;
  receivedAt?: string;
  totalPaid: number;
  isActive: boolean;
}

export interface CreateTontineInput {
  name: string;
  description?: string;
  totalMembers: number;
  contributionAmount: number;
  currency?: string;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: string;
  rules?: string;
  members: Array<{
    name: string;
    phone?: string;
    email?: string;
    position: number;
  }>;
}

export interface AddContributionInput {
  memberId: string;
  amount: number;
  round: number;
  paymentMethod?: string;
  notes?: string;
}

class TontinesService {
  async getAll(): Promise<Tontine[]> {
    const response = await api.get<{ data: Tontine[] }>('/tontines');
    return response.data.data;
  }

  async getById(id: string): Promise<Tontine> {
    const response = await api.get<{ data: Tontine }>(`/tontines/${id}`);
    return response.data.data;
  }

  async create(data: CreateTontineInput): Promise<Tontine> {
    const response = await api.post<{ data: Tontine }>('/tontines', data);
    return response.data.data;
  }

  async update(id: string, data: Partial<CreateTontineInput>): Promise<Tontine> {
    const response = await api.put<{ data: Tontine }>(`/tontines/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/tontines/${id}`);
  }

  async addContribution(id: string, data: AddContributionInput): Promise<any> {
    const response = await api.post<{ data: any }>(`/tontines/${id}/contributions`, data);
    return response.data.data;
  }

  async getStats(id: string): Promise<any> {
    const response = await api.get<{ data: any }>(`/tontines/${id}/stats`);
    return response.data.data;
  }

  async deleteContribution(tontineId: string, contributionId: string): Promise<void> {
    await api.delete(`/tontines/${tontineId}/contributions/${contributionId}`);
  }
}

export default new TontinesService();
