import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services/accounts.service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Layout from '../components/Layout';
import { Plus, Edit, Trash2, Wallet, CreditCard, Banknote } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { AccountType, CURRENCIES } from '@budgetwise/shared';
import type { Account, CreateAccountInput } from '../types';

export default function AccountsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: accountsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: accountsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      accountsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setEditingAccount(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: accountsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK:
        return <Banknote className="h-6 w-6 text-blue-500" />;
      case AccountType.CASH:
        return <Wallet className="h-6 w-6 text-green-500" />;
      case AccountType.CARD:
        return <CreditCard className="h-6 w-6 text-purple-500" />;
      default:
        return <Wallet className="h-6 w-6 text-gray-500" />;
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Comptes</h1>
            <p className="mt-2 text-gray-600">
              Solde total : {formatCurrency(totalBalance)}
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-5 w-5" />
            Nouveau compte
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getAccountIcon(account.type)}
                    <CardTitle>{account.name}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAccount(account)}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
                          deleteMutation.mutate(account.id);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Solde</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(Number(account.balance))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium">{account.type}</span>
                  </div>
                  {account.currency && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Devise</span>
                      <span className="text-sm">{account.currency}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun compte
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer votre premier compte
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-5 w-5" />
              Créer un compte
            </Button>
          </div>
        )}
      </div>

      <AccountFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createMutation.mutate}
        isLoading={createMutation.isPending}
      />

      {editingAccount && (
        <AccountFormModal
          isOpen={true}
          onClose={() => setEditingAccount(null)}
          onSubmit={(data) =>
            updateMutation.mutate({ id: editingAccount.id, data })
          }
          isLoading={updateMutation.isPending}
          initialData={editingAccount}
        />
      )}
    </Layout>
  );
}

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountInput) => void;
  isLoading: boolean;
  initialData?: Account;
}

function AccountFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: AccountFormModalProps) {
  const [formData, setFormData] = useState<CreateAccountInput>({
    name: initialData?.name || '',
    type: initialData?.type || AccountType.BANK,
    initialBalance: initialData?.balance || 0,
    currency: initialData?.currency || 'EUR',
    color: initialData?.color || '#3B82F6',
    isDefault: initialData?.isDefault || false,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Modifier le compte' : 'Nouveau compte'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom du compte"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Mon compte courant"
          required
        />

        <Select
          label="Type de compte"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as AccountType })
          }
          options={[
            { value: AccountType.BANK, label: 'Compte bancaire' },
            { value: AccountType.CASH, label: 'Espèces' },
            { value: AccountType.SAVINGS, label: 'Épargne' },
            { value: AccountType.CARD, label: 'Carte' },
            { value: AccountType.MOBILE_MONEY, label: 'Mobile Money' },
            { value: AccountType.INVESTMENT, label: 'Investissement' },
          ]}
          required
        />

        <Input
          label="Solde initial"
          type="number"
          step="0.01"
          value={formData.initialBalance}
          onChange={(e) =>
            setFormData({ ...formData, initialBalance: Number(e.target.value) })
          }
          required
        />

        <Select
          label="Devise"
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          options={CURRENCIES.map(currency => ({
            value: currency.code,
            label: `${currency.name} (${currency.symbol})`
          }))}
          required
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
