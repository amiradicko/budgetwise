import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { budgetsService } from '../services/budgets.service';
import { categoriesService } from '../services/categories.service';
import type { Budget, Category, CreateBudgetInput, UpdateBudgetInput } from '@budgetwise/shared';
import { BudgetPeriod } from '@budgetwise/shared';
import { formatCurrency } from '../lib/utils';

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<CreateBudgetInput>({
    name: '',
    categoryId: '',
    amount: 0,
    currency: 'EUR',
    period: BudgetPeriod.MONTHLY,
    startDate: new Date(),
    endDate: undefined,
    alertThreshold: 80,
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsData, categoriesData] = await Promise.all([
        budgetsService.getAll(),
        categoriesService.getAll(),
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'amount' || name === 'alertThreshold') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'startDate' || name === 'endDate') {
      setFormData((prev) => ({ ...prev, [name]: value ? new Date(value) : undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        const updateData: UpdateBudgetInput = {
          name: formData.name,
          categoryId: formData.categoryId,
          amount: formData.amount,
          currency: formData.currency,
          period: formData.period,
          startDate: formData.startDate,
          endDate: formData.endDate,
          alertThreshold: formData.alertThreshold,
          isActive: formData.isActive,
        };
        await budgetsService.update(editingBudget.id, updateData);
      } else {
        await budgetsService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde du budget');
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name,
      categoryId: budget.categoryId || '',
      amount: budget.amount,
      currency: budget.currency,
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: budget.alertThreshold,
      isActive: budget.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) return;
    
    try {
      await budgetsService.delete(id);
      loadData();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression du budget');
    }
  };

  const resetForm = () => {
    setEditingBudget(null);
    setFormData({
      name: '',
      categoryId: '',
      amount: 0,
      currency: 'EUR',
      period: BudgetPeriod.MONTHLY,
      startDate: new Date(),
      endDate: undefined,
      alertThreshold: 80,
      isActive: true,
    });
  };

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return 'Sans catégorie';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || 'Catégorie inconnue';
  };

  const getProgressPercentage = () => {
    // Note: Budget type doesn't have 'spent' field
    // This should be fetched from BudgetProgress API endpoint
    return 0;
  };

  const getProgressColor = (percentage: number, budget: Budget) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= budget.alertThreshold) return 'bg-yellow-500';
    return 'bg-green-500';
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
          <h1 className="text-3xl font-bold">Budgets</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            Créer un budget
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = getProgressPercentage();
            const progressColor = getProgressColor(progress, budget);

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <CardTitle>{getCategoryName(budget.categoryId)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                          Budget: {formatCurrency(budget.amount)}
                        </span>
                        <span className="font-semibold">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${progressColor} transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Nom: {budget.name}</p>
                      <p>Période: {budget.period}</p>
                      <p>Devise: {budget.currency}</p>
                      <p>Seuil d'alerte: {budget.alertThreshold}%</p>
                      <p>Statut: {budget.isActive ? '✓ Actif' : '✗ Inactif'}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(budget)}
                        className="flex-1"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                        className="flex-1"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <Card>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Aucun budget créé. Cliquez sur "Créer un budget" pour commencer.
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
          title={editingBudget ? 'Modifier le budget' : 'Créer un budget'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom du budget"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Select
              label="Catégorie (optionnel)"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Aucune catégorie' },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })),
              ]}
            />

            <Input
              label="Montant"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />

            <Select
              label="Devise"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              options={[
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'USD', label: 'Dollar ($)' },
                { value: 'GBP', label: 'Livre (£)' },
                { value: 'XOF', label: 'Franc CFA' },
              ]}
              required
            />

            <Select
              label="Période"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              options={[
                { value: BudgetPeriod.DAILY, label: 'Quotidien' },
                { value: BudgetPeriod.WEEKLY, label: 'Hebdomadaire' },
                { value: BudgetPeriod.MONTHLY, label: 'Mensuel' },
                { value: BudgetPeriod.QUARTERLY, label: 'Trimestriel' },
                { value: BudgetPeriod.YEARLY, label: 'Annuel' },
              ]}
              required
            />

            <Input
              label="Date de début"
              type="date"
              name="startDate"
              value={formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Date de fin (optionnelle)"
              type="date"
              name="endDate"
              value={formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
            />

            <Input
              label="Seuil d'alerte (%)"
              type="number"
              name="alertThreshold"
              value={formData.alertThreshold}
              onChange={handleInputChange}
              min="0"
              max="100"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm">
                Budget actif
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingBudget ? 'Modifier' : 'Créer'}
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
      </div>
    </Layout>
  );
}
