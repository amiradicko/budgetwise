import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { goalsService } from '../services/goals.service';
import type { SavingGoal, CreateSavingGoalInput, UpdateSavingGoalInput } from '@budgetwise/shared';
import { formatCurrency, formatDate } from '../lib/utils';

export function GoalsPage() {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<SavingGoal | null>(null);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [contributionNotes, setContributionNotes] = useState('');
  const [formData, setFormData] = useState<CreateSavingGoalInput>({
    name: '',
    targetAmount: 0,
    targetDate: new Date(),
    description: '',
    color: '#10B981',
    currency: 'EUR',
    priority: 3,
    initialAmount: 0,
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await goalsService.getAll();
      setGoals(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des objectifs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'targetAmount' || name === 'initialAmount' || name === 'priority') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'targetDate') {
      setFormData((prev) => ({ ...prev, [name]: value ? new Date(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        const updateData: UpdateSavingGoalInput = {
          name: formData.name,
          targetAmount: formData.targetAmount,
          targetDate: formData.targetDate,
          description: formData.description,
          color: formData.color,
        };
        await goalsService.update(editingGoal.id, updateData);
      } else {
        await goalsService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadGoals();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde de l\'objectif');
    }
  };

  const handleEdit = (goal: SavingGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
      description: goal.description || '',
      color: goal.color || '#10B981',
      currency: goal.currency,
      priority: goal.priority,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) return;
    
    try {
      await goalsService.delete(id);
      loadGoals();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'objectif');
    }
  };

  const handleAddContribution = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      await goalsService.addContribution(selectedGoal.id, contributionAmount, contributionNotes || undefined);
      setIsContributionModalOpen(false);
      setContributionAmount(0);
      setContributionNotes('');
      setSelectedGoal(null);
      loadGoals();
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la contribution:', err);
      setError('Erreur lors de l\'ajout de la contribution');
    }
  };

  const openContributionModal = (goal: SavingGoal) => {
    setSelectedGoal(goal);
    setIsContributionModalOpen(true);
  };

  const resetForm = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: 0,
      targetDate: new Date(),
      description: '',
      color: '#10B981',
      currency: 'EUR',
      priority: 3,
      initialAmount: 0,
    });
  };

  const getProgressPercentage = (goal: SavingGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (targetDate: Date | undefined) => {
    if (!targetDate) return 0;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Objectifs d'épargne</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            Créer un objectif
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: goal.color || '#10B981' }}
                    />
                    {goal.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="font-semibold">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    )}

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Date cible: {goal.targetDate ? formatDate(goal.targetDate) : 'Non définie'}</p>
                      <p className={daysRemaining < 0 ? 'text-red-500' : ''}>
                        {daysRemaining < 0
                          ? `En retard de ${Math.abs(daysRemaining)} jours`
                          : `${daysRemaining} jours restants`}
                      </p>
                      <p>Restant: {formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
                    </div>

                    {isCompleted && (
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded text-sm text-center font-semibold">
                        🎉 Objectif atteint !
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!isCompleted && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openContributionModal(goal)}
                          className="flex-1"
                        >
                          Contribuer
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(goal)}
                        className="flex-1"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {goals.length === 0 && (
          <Card>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Aucun objectif créé. Cliquez sur "Créer un objectif" pour commencer.
              </p>
            </CardContent>
          </Card>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingGoal ? 'Modifier l\'objectif' : 'Créer un objectif'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom de l'objectif"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Montant cible"
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />

            {!editingGoal && (
              <Input
                label="Montant initial"
                type="number"
                name="initialAmount"
                value={formData.initialAmount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            )}

            <Input
              label="Date cible"
              type="date"
              name="targetDate"
              value={formData.targetDate instanceof Date ? formData.targetDate.toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <Input
              label="Couleur"
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingGoal ? 'Modifier' : 'Créer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isContributionModalOpen}
          onClose={() => {
            setIsContributionModalOpen(false);
            setContributionAmount(0);
            setContributionNotes('');
            setSelectedGoal(null);
          }}
          title={`Contribuer à ${selectedGoal?.name || ''}`}
        >
          <form onSubmit={handleAddContribution} className="space-y-4">
            <Input
              label="Montant"
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">Notes (optionnel)</label>
              <textarea
                value={contributionNotes}
                onChange={(e) => setContributionNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Ajouter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsContributionModalOpen(false);
                  setContributionAmount(0);
                  setContributionNotes('');
                  setSelectedGoal(null);
                }}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
