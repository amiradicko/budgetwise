import api from '../lib/api';
import type {
  BillSplit,
  CreateBillSplitRequest,
  UpdateBillSplitRequest,
  RecordPaymentRequest,
  BillSplitListResponse,
} from '@budgetwise/shared';

class BillSplitService {
  /**
   * Créer un partage de facture
   */
  async createBillSplit(data: CreateBillSplitRequest): Promise<BillSplit> {
    const response = await api.post('/bill-splits', data);
    return response.data;
  }

  /**
   * Partager également entre les participants
   */
  async splitEqually(title: string, totalAmount: number, participants: string[]): Promise<BillSplit> {
    const response = await api.post('/bill-splits/split-equally', {
      title,
      totalAmount,
      participants,
    });
    return response.data;
  }

  /**
   * Obtenir tous les partages de facture
   */
  async getBillSplits(): Promise<BillSplitListResponse> {
    const response = await api.get('/bill-splits');
    return response.data;
  }

  /**
   * Obtenir un partage spécifique
   */
  async getBillSplit(id: string): Promise<BillSplit> {
    const response = await api.get(`/bill-splits/${id}`);
    return response.data;
  }

  /**
   * Obtenir les statistiques
   */
  async getStats(id: string): Promise<any> {
    const response = await api.get(`/bill-splits/${id}/stats`);
    return response.data;
  }

  /**
   * Mettre à jour un partage
   */
  async updateBillSplit(id: string, data: UpdateBillSplitRequest): Promise<BillSplit> {
    const response = await api.patch(`/bill-splits/${id}`, data);
    return response.data;
  }

  /**
   * Enregistrer un paiement
   */
  async recordPayment(id: string, data: RecordPaymentRequest): Promise<any> {
    const response = await api.post(`/bill-splits/${id}/payments`, data);
    return response.data;
  }

  /**
   * Supprimer un partage
   */
  async deleteBillSplit(id: string): Promise<void> {
    await api.delete(`/bill-splits/${id}`);
  }
}

export default new BillSplitService();
