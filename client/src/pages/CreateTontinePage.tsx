import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import tontinesService from '../services/tontines.service';

interface Member {
  name: string;
  phone: string;
  email: string;
  position: number;
}

export default function CreateTontinePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalMembers: 5,
    contributionAmount: '',
    currency: user?.currency || 'XOF',
    frequency: 'MONTHLY' as 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    rules: '',
  });

  const [members, setMembers] = useState<Member[]>([
    { name: '', phone: '', email: '', position: 1 },
    { name: '', phone: '', email: '', position: 2 },
    { name: '', phone: '', email: '', position: 3 },
    { name: '', phone: '', email: '', position: 4 },
    { name: '', phone: '', email: '', position: 5 },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'totalMembers') {
      const count = parseInt(value);
      setFormData({ ...formData, [name]: count });
      
      // Ajuster la liste des membres
      const newMembers = Array.from({ length: count }, (_, i) => {
        if (i < members.length) {
          return { ...members[i], position: i + 1 };
        }
        return { name: '', phone: '', email: '', position: i + 1 };
      });
      setMembers(newMembers);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleMemberChange = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      addToast({ type: 'error', title: 'Erreur', message: 'Le nom de la tontine est requis' });
      return;
    }

    if (!formData.contributionAmount || parseFloat(formData.contributionAmount) <= 0) {
      addToast({ type: 'error', title: 'Erreur', message: 'Le montant de contribution doit être supérieur à 0' });
      return;
    }

    // Vérifier que tous les membres ont un nom
    const emptyMembers = members.filter((m) => !m.name.trim());
    if (emptyMembers.length > 0) {
      addToast({ type: 'error', title: 'Erreur', message: 'Tous les membres doivent avoir un nom' });
      return;
    }

    try {
      setLoading(true);

      await tontinesService.create({
        ...formData,
        contributionAmount: parseFloat(formData.contributionAmount),
        members: members.map((m) => ({
          name: m.name,
          phone: m.phone || undefined,
          email: m.email || undefined,
          position: m.position,
        })),
      });

      addToast({ type: 'success', title: 'Succès', message: '🎉 Tontine créée avec succès !' });
      navigate('/tontines');
    } catch (error: any) {
      console.error('Error creating tontine:', error);
      addToast({ 
        type: 'error', 
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la création de la tontine' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/tontines')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gradient flex items-center gap-3">
                <Users className="h-10 w-10" />
                Créer une Tontine
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Configurez votre groupe d'épargne collective
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de la Tontine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom de la tontine *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Tontine Amis 2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description de la tontine..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre de membres *
                    </label>
                    <Input
                      type="number"
                      name="totalMembers"
                      value={formData.totalMembers}
                      onChange={handleInputChange}
                      min="2"
                      max="50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contribution par tour *
                    </label>
                    <Input
                      type="number"
                      name="contributionAmount"
                      value={formData.contributionAmount}
                      onChange={handleInputChange}
                      placeholder="50000"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Devise
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                    >
                      <option value="XOF">XOF - Franc CFA BCEAO</option>
                      <option value="XAF">XAF - Franc CFA BEAC</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dollar</option>
                      <option value="GBP">GBP - Livre Sterling</option>
                      <option value="CAD">CAD - Dollar Canadien</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fréquence *
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                    >
                      <option value="WEEKLY">Hebdomadaire</option>
                      <option value="BIWEEKLY">Bi-hebdomadaire</option>
                      <option value="MONTHLY">Mensuelle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de début *
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Règles (optionnel)
                  </label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleInputChange}
                    placeholder="Règles spécifiques de la tontine..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Liste des membres */}
            <Card>
              <CardHeader>
                <CardTitle>Membres de la Tontine ({members.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  La position détermine l'ordre de rotation. Position 1 reçoit en premier, etc.
                </p>

                {members.map((member, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full gradient-primary text-white text-sm font-semibold">
                        #{member.position}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Membre {index + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        placeholder="Nom complet *"
                        required
                      />
                      <Input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                        placeholder="Téléphone (optionnel)"
                      />
                      <Input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        placeholder="Email (optionnel)"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Résumé */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total des membres</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formData.totalMembers}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Contribution par tour</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formData.contributionAmount} {formData.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total par tour</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                    {formData.contributionAmount 
                      ? (parseFloat(formData.contributionAmount) * formData.totalMembers).toLocaleString() 
                      : 0} {formData.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Nombre de tours</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {formData.totalMembers}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tontines')}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    Créer la Tontine
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
