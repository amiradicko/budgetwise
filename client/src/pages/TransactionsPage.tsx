import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsService } from '../services/transactions.service';
import { accountsService } from '../services/accounts.service';
import { categoriesService } from '../services/categories.service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Layout from '../components/Layout';
import { Plus, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { TransactionType, type Transaction } from '@budgetwise/shared';
import type { CreateTransactionInput } from '../types';
import { useExportPDF } from '../hooks/useExportPDF';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const queryClient = useQueryClient();
  const { exportTransactionsToPDF } = useExportPDF();

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getAll(),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsService.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: transactionsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setIsCreateModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: transactionsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const filteredTransactions = transactions.filter(
    (t) => filterType === 'all' || t.type === filterType
  );

  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const handleExportPDF = () => {
    exportTransactionsToPDF({
      title: 'Rapport des Transactions',
      subtitle: `Généré le ${format(new Date(), 'dd/MM/yyyy')}`,
      transactions: filteredTransactions,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-5 w-5" />
              Exporter PDF
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-5 w-5" />
              Nouvelle transaction
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenus</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dépenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalExpense)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solde net</p>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalIncome - totalExpense)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filterType === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            Toutes
          </Button>
          <Button
            variant={filterType === TransactionType.INCOME ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterType(TransactionType.INCOME)}
          >
            Revenus
          </Button>
          <Button
            variant={filterType === TransactionType.EXPENSE ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterType(TransactionType.EXPENSE)}
          >
            Dépenses
          </Button>
          <Button
            variant={filterType === TransactionType.TRANSFER ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilterType(TransactionType.TRANSFER)}
          >
            Transferts
          </Button>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucune transaction</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${transaction.type === TransactionType.INCOME ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.type === TransactionType.INCOME ? (
                          <ArrowUpCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <ArrowDownCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description || 'Transaction'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(new Date(transaction.date))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === TransactionType.INCOME ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </p>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer cette transaction ?')) {
                            deleteMutation.mutate(transaction.id);
                          }
                        }}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createMutation.mutate}
        isLoading={createMutation.isPending}
        accounts={accounts}
        categories={categories}
      />
    </Layout>
  );
}

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput) => void;
  isLoading: boolean;
  accounts: any[];
  categories: any[];
}

function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  accounts,
  categories,
}: TransactionFormModalProps) {
  const [formData, setFormData] = useState<CreateTransactionInput>({
    type: TransactionType.EXPENSE,
    amount: 0,
    description: '',
    date: new Date(),
    accountId: accounts[0]?.id || '',
    categoryId: categories[0]?.id || '',
    currency: 'EUR',
    isRecurring: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvelle transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as TransactionType })
          }
          options={[
            { value: TransactionType.INCOME, label: 'Revenu' },
            { value: TransactionType.EXPENSE, label: 'Dépense' },
            { value: TransactionType.TRANSFER, label: 'Transfert' },
          ]}
          required
        />

        <Input
          label="Montant"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: Number(e.target.value) })
          }
          required
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Courses, Salaire, etc."
          required
        />

        <Input
          label="Date"
          type="date"
          value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date}
          onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
          required
        />

        <Select
          label="Compte"
          value={formData.accountId}
          onChange={(e) =>
            setFormData({ ...formData, accountId: e.target.value })
          }
          options={accounts.map((acc) => ({
            value: acc.id,
            label: acc.name,
          }))}
          required
        />

        <Select
          label="Catégorie"
          value={formData.categoryId || ''}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          options={[
            { value: '', label: 'Aucune catégorie' },
            ...categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })),
          ]}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
