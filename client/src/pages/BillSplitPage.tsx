import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import billSplitService from '../services/billSplit.service';
import type { BillSplit, BillParticipant } from '@budgetwise/shared';
import { Card } from '../components/ui/Card';
import { Plus, Users, CheckCircle, Clock, DollarSign, Trash2, X } from 'lucide-react';
import Modal from '../components/ui/Modal';

const BillSplitPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<BillParticipant | null>(null);

  const queryClient = useQueryClient();

  // Récupérer les partages
  const { data: billSplitsData, isLoading } = useQuery({
    queryKey: ['billSplits'],
    queryFn: () => billSplitService.getBillSplits(),
  });

  // Créer un partage (division égale)
  const createMutation = useMutation({
    mutationFn: ({ title, amount, participants }: { title: string; amount: number; participants: string[] }) =>
      billSplitService.splitEqually(title, amount, participants),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billSplits'] });
      setIsCreateModalOpen(false);
    },
  });

  // Enregistrer un paiement
  const paymentMutation = useMutation({
    mutationFn: ({ billId, participantId, amount }: { billId: string; participantId: string; amount: number }) =>
      billSplitService.recordPayment(billId, { participantId, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billSplits'] });
      setIsPaymentModalOpen(false);
      setSelectedParticipant(null);
    },
  });

  // Supprimer un partage
  const deleteMutation = useMutation({
    mutationFn: (id: string) => billSplitService.deleteBillSplit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billSplits'] });
    },
  });

  const handleCreateBillSplit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get('title') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const participantsText = formData.get('participants') as string;
    const participants = participantsText.split(',').map(p => p.trim()).filter(p => p);

    createMutation.mutate({ title, amount, participants });
  };

  const handleRecordPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedParticipant || !selectedBillId) return;

    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);

    paymentMutation.mutate({
      billId: selectedBillId,
      participantId: selectedParticipant.id,
      amount,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PENDING':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Complété';
      case 'PARTIAL':
        return 'En cours';
      case 'PENDING':
        return 'En attente';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partage de Factures</h1>
          <p className="text-gray-600 mt-1">Divisez facilement les factures avec vos amis</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau Partage
        </button>
      </div>

      {/* Liste des partages */}
      {billSplitsData?.billSplits && billSplitsData.billSplits.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {billSplitsData.billSplits.map((bill: BillSplit) => {
            const totalPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
            const percentage = (totalPaid / bill.totalAmount) * 100;
            const paidCount = bill.participants.filter(p => p.isPaid).length;

            return (
              <Card key={bill.id} className="hover:shadow-lg transition-shadow">
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{bill.title}</h3>
                      {bill.description && (
                        <p className="text-sm text-gray-600 mt-1">{bill.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bill.status)}`}>
                        {getStatusLabel(bill.status)}
                      </span>
                      <button
                        onClick={() => deleteMutation.mutate(bill.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Montant total */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Montant total</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(bill.totalAmount)} XOF</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-semibold text-gray-900">{Math.round(percentage)}%</span>
                    </div>
                    <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                      <span>{paidCount} / {bill.participants.length} payés</span>
                      <span>{Math.round(totalPaid)} / {Math.round(bill.totalAmount)} XOF</span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Participants
                    </h4>
                    {bill.participants.map((participant) => (
                      <div
                        key={participant.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          participant.isPaid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {participant.isPaid ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{participant.name}</p>
                            <p className="text-sm text-gray-600">{Math.round(participant.shareAmount)} XOF</p>
                          </div>
                        </div>
                        {!participant.isPaid && (
                          <button
                            onClick={() => {
                              setSelectedBillId(bill.id);
                              setSelectedParticipant(participant);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                          >
                            Marquer payé
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun partage de facture</h3>
          <p className="text-gray-600 mb-6">Créez votre premier partage pour commencer</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau Partage
          </button>
        </Card>
      )}

      {/* Modal de création */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nouveau Partage</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBillSplit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Ex: Restaurant du 01/07"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant total (XOF)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="participants"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Alice, Bob, Charlie"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le montant sera divisé également entre tous les participants
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </Modal>

      {/* Modal de paiement */}
      {selectedParticipant && (
        <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Enregistrer un paiement</h2>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">Participant</p>
              <p className="text-lg font-bold text-gray-900">{selectedParticipant.name}</p>
              <p className="text-sm text-gray-600 mt-2">Montant dû</p>
              <p className="text-lg font-bold text-gray-900">{Math.round(selectedParticipant.shareAmount)} XOF</p>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant payé (XOF)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  max={selectedParticipant.shareAmount}
                  step="0.01"
                  defaultValue={selectedParticipant.shareAmount}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={paymentMutation.isPending}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {paymentMutation.isPending ? 'Enregistrement...' : 'Confirmer le paiement'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BillSplitPage;
