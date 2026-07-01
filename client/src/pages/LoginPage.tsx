import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl">
                <LogIn className="h-10 w-10" />
              </div>
              <h1 className="text-5xl font-bold">BudgetWise</h1>
            </div>
            <p className="text-2xl font-light text-white/90">
              Prenez le contrôle de vos finances
            </p>
            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Gestion simplifiée</h3>
                  <p className="text-white/80">Suivez vos dépenses et revenus en temps réel</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Budgets intelligents</h3>
                  <p className="text-white/80">Créez et gérez vos budgets facilement</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Objectifs personnalisés</h3>
                  <p className="text-white/80">Atteignez vos objectifs financiers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 animate-slide-up">
          <div className="text-center">
            <div className="inline-block p-3 gradient-primary rounded-2xl shadow-glow mb-4 lg:hidden">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Bienvenue !
            </h2>
            <p className="text-gray-600">
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-slide-up">
                <p className="text-sm text-red-800 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-gradient hover:opacity-80 transition-opacity"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-medium rounded-xl text-white gradient-primary hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Se connecter
                </>
              )}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Pas encore de compte ? </span>
              <Link
                to="/register"
                className="font-semibold text-gradient hover:opacity-80 transition-opacity"
              >
                Créer un compte
              </Link>
            </div>
          </form>

          {/* Branding Nefertiti Digital Solutions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col items-center gap-3">
              {/* Logo NDS */}
              <img 
                src="/nefertiti-logo.png" 
                alt="Nefertiti Digital Solutions" 
                className="h-6 object-contain opacity-60"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Powered by */}
              <p className="text-xs text-gray-500">
                Powered by <span className="font-semibold text-[#0088ff]">Nefertiti Digital Solutions</span>
              </p>
              
              {/* Copyright */}
              <p className="text-xs text-gray-400">
                © 2026 Nefertiti Digital Solutions. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
