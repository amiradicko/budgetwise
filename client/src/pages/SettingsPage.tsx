import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { usersService } from '../services/users.service';
import { CURRENCIES } from '@budgetwise/shared';

export function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  // App preferences
  const [preferences, setPreferences] = useState({
    currency: 'EUR',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light' as 'light' | 'dark' | 'auto',
    notifications: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
      setPreferences(prev => ({
        ...prev,
        currency: user.currency || 'EUR',
        language: user.language || 'fr',
        theme: (user.theme as 'light' | 'dark' | 'auto') || 'light',
      }));
    }
  }, [user]);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Mot de passe modifié avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la modification du mot de passe');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPreferences((prev) => ({ ...prev, [name]: checked }));
    } else {
      setPreferences((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSavePreferences = async () => {
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      await usersService.updateProfile({
        currency: preferences.currency,
        language: preferences.language,
        theme: preferences.theme,
      });
      
      // Refresh user data in AuthContext
      await refreshUser();
      
      setSuccess('✅ Préférences sauvegardées avec succès ! La page va se rafraîchir...');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Refresh page after 2 seconds to apply theme and other changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde des préférences');
      console.error(err);
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Paramètres</h1>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg animate-slide-up">
            <p className="font-semibold text-lg">❌ Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg animate-slide-up">
            <p className="font-semibold text-lg">{success}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Prénom"
                  type="text"
                  value={profileData.firstName}
                  disabled
                />
                <Input
                  label="Nom"
                  type="text"
                  value={profileData.lastName}
                  disabled
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  disabled
                />
                <p className="text-sm text-gray-500">
                  La modification du profil sera disponible prochainement
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Modifier le mot de passe</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  required
                  helperText="Au moins 8 caractères"
                />
                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Modification...' : 'Modifier le mot de passe'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Préférences de l'application</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  label="Devise"
                  name="currency"
                  value={preferences.currency}
                  onChange={handlePreferenceChange}
                  options={CURRENCIES.map(currency => ({
                    value: currency.code,
                    label: `${currency.name} (${currency.symbol})`
                  }))}
                />

                <Select
                  label="Langue"
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferenceChange}
                  options={[
                    { value: 'fr', label: 'Français' },
                    { value: 'en', label: 'English' },
                  ]}
                />

                <Select
                  label="Format de date"
                  name="dateFormat"
                  value={preferences.dateFormat}
                  onChange={handlePreferenceChange}
                  options={[
                    { value: 'DD/MM/YYYY', label: 'JJ/MM/AAAA' },
                    { value: 'MM/DD/YYYY', label: 'MM/JJ/AAAA' },
                    { value: 'YYYY-MM-DD', label: 'AAAA-MM-JJ' },
                  ]}
                />

                <Select
                  label="Thème"
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferenceChange}
                  options={[
                    { value: 'light', label: 'Clair' },
                    { value: 'dark', label: 'Sombre' },
                    { value: 'auto', label: 'Automatique' },
                  ]}
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={preferences.notifications}
                    onChange={handlePreferenceChange}
                    className="w-4 h-4"
                  />
                  <label htmlFor="notifications" className="text-sm">
                    Activer les notifications
                  </label>
                </div>

                <Button onClick={handleSavePreferences} className="w-full" disabled={loading}>
                  {loading ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Statut du compte</p>
                  <p className="font-semibold text-green-600">Actif</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{user?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Devise par défaut</p>
                  <p className="font-semibold">{user?.currency || 'EUR'}</p>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="danger" className="w-full" disabled>
                    Supprimer le compte
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Cette action sera disponible prochainement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle>Aide & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold mb-1">Documentation</h3>
                <p className="text-sm text-gray-600">
                  Consultez notre guide d'utilisation
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold mb-1">Support</h3>
                <p className="text-sm text-gray-600">
                  Contactez notre équipe d'assistance
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">ℹ️</div>
                <h3 className="font-semibold mb-1">À propos</h3>
                <p className="text-sm text-gray-600">
                  Version 1.0.0 - BudgetWise
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
