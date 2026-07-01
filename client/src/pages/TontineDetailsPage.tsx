import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Award,
  Trash2,
} from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useToast } from '../components/Toast';
import tontinesService, { type Tontine, type AddContributionInput } from '../services/tontines.service';

export default function TontineDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [tontine, setTontine] = useState<Tontine | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [contributionForm, setContributionForm] = useState<AddContributionInput>({
    memberId: '',
    amount: 0,
    round: 1,
    paymentMethod: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      loadTontineDetails();
    }
  }, [id]);

  const loadTontineDetails = async () => {
    try {
      setLoading(true);
      const [tontineData, statsData] = await Promise.all([
        tontinesService.getById(id!),
        tontinesService.getStats(id!),
      ]);
      setTontine(tontineData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading tontine:', error);
      addToast({ type: 'error', title: 'Erreur', message: 'Impossible de charger la tontine' });
      navigate('/tontines');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenContributionModal = (member: any) => {
    setSelectedMember(member);
    setContributionForm({
      memberId: member.id,
      amount: Number(tontine?.contributionAmount || 0),
      round: tontine?.currentRound || 1,
      paymentMethod: 'MOBILE_MONEY',
      notes: '',
    });
    setShowContributionModal(true);
  };

  const handleAddContribution = async () => {
    try {
      await tontinesService.addContribution(id!, contributionForm);
      addToast({
        type: 'success',
        title: 'Succès',
        message: `✅ Contribution de ${selectedMember?.name} enregistrée !`,
      });
      setShowContributionModal(false);
      loadTontineDetails();
    } catch (error: any) {
      console.error('Error adding contribution:', error);
      addToast({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de l\'ajout de la contribution',
      });
    }
  };

  const handleDeleteContribution = async (contributionId: string, memberName: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer cette contribution de ${memberName} ?`)) {
      return;
    }

    try {
      await tontinesService.deleteContribution(id!, contributionId);
      addToast({
        type: 'success',
        title: 'Supprimé',
        message: '🗑️ Contribution supprimée avec succès',
      });
      loadTontineDetails();
    } catch (error: any) {
      console.error('Error deleting contribution:', error);
      addToast({
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression',
      });
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'COMPLETED':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'PAUSED':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Terminée';
      case 'PAUSED':
        return 'En pause';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'WEEKLY':
        return 'Hebdomadaire';
      case 'BIWEEKLY':
        return 'Bi-hebdomadaire';
      case 'MONTHLY':
        return 'Mensuelle';
      default:
        return frequency;
    }
  };

  if (loading || !tontine) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/tontines')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-gradient">{tontine.name}</h1>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(tontine.status)}`}>
                  {getStatusLabel(tontine.status)}
                </span>
              </div>
              {tontine.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">{tontine.description}</p>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl gradient-primary">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Collecté</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(Number(stats?.totalAmount || 0), tontine.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tour Actuel</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {tontine.currentRound} / {tontine.totalMembers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Membres</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {tontine.totalMembers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fréquence</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {getFrequencyLabel(tontine.frequency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Progression Globale
                </h3>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(stats?.progress || 0)}%
                </span>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                  style={{ width: `${stats?.progress || 0}%` }}
                ></div>
              </div>
              {tontine.status === 'ACTIVE' && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Prochain paiement : <strong>{formatDate(tontine.nextPaymentDate)}</strong>
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle>Membres de la Tontine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tontine.members?.map((member: any) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded-full gradient-primary text-white text-xs font-semibold">
                          #{member.position}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {member.name}
                          </p>
                          {member.phone && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">{member.phone}</p>
                          )}
                        </div>
                      </div>
                      {member.hasReceived && (
                        <span title="A reçu" className="flex items-center">
                          <Award className="h-5 w-5 text-yellow-500" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm mt-3">
                      <span className="text-gray-600 dark:text-gray-400">Total payé</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(Number(member.totalPaid), tontine.currency)}
                      </span>
                    </div>

                    {tontine.status === 'ACTIVE' && member.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleOpenContributionModal(member)}
                      >
                        <Plus className="h-4 w-4" />
                        Ajouter contribution
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Contributions */}
            <Card>
              <CardHeader>
                <CardTitle>Contributions Récentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tontine.contributions && tontine.contributions.length > 0 ? (
                  tontine.contributions.slice(0, 10).map((contribution: any) => (
                    <div
                      key={contribution.id}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 group hover:border-red-300 dark:hover:border-red-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {contribution.member?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(Number(contribution.amount), tontine.currency)}
                          </span>
                          {tontine.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleDeleteContribution(contribution.id, contribution.member?.name)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Tour {contribution.round}</span>
                        <span>{formatDate(contribution.paidAt)}</span>
                      </div>
                      {contribution.paymentMethod && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Méthode : {contribution.paymentMethod}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune contribution pour le moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rotations Completed */}
          {tontine.rotations && tontine.rotations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historique des Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tontine.rotations.map((rotation: any) => (
                    <div
                      key={rotation.id}
                      className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-emerald-500">
                            <Award className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              Tour {rotation.round} - {rotation.member?.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(rotation.receivedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(Number(rotation.totalAmount), tontine.currency)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Reçu</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Contribution Modal */}
      <Modal
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        title={`Contribution - ${selectedMember?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Montant
            </label>
            <Input
              type="number"
              value={contributionForm.amount}
              onChange={(e) =>
                setContributionForm({ ...contributionForm, amount: parseFloat(e.target.value) })
              }
              placeholder="Montant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tour
            </label>
            <Input
              type="number"
              value={contributionForm.round}
              onChange={(e) =>
                setContributionForm({ ...contributionForm, round: parseInt(e.target.value) })
              }
              placeholder="Numéro du tour"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Méthode de paiement
            </label>
            <select
              value={contributionForm.paymentMethod}
              onChange={(e) =>
                setContributionForm({ ...contributionForm, paymentMethod: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
            >
              <option value="">Sélectionner...</option>
              <option value="CASH">Espèces</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="BANK_TRANSFER">Virement Bancaire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={contributionForm.notes}
              onChange={(e) => setContributionForm({ ...contributionForm, notes: e.target.value })}
              rows={3}
              placeholder="Notes..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowContributionModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleAddContribution}>
              <Plus className="h-5 w-5" />
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
