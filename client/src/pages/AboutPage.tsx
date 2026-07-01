import { Rocket, Shield, Users, Zap, Award, Globe } from 'lucide-react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header avec les deux logos */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-8 mb-6">
              {/* Logo BudgetWise */}
              <img 
                src="/icon-simple.svg" 
                alt="BudgetWise" 
                className="w-20 h-20 drop-shadow-lg"
              />
              
              {/* Connecteur */}
              <div className="w-16 h-px bg-gradient-to-r from-[#00d9ff] to-[#0088ff]"></div>
              
              {/* Logo Nefertiti */}
              <img 
                src="/nefertiti-logo.png" 
                alt="Nefertiti Digital Solutions" 
                className="h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              À propos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0088ff]">BudgetWise</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Plateforme moderne de gestion financière personnelle
            </p>
            
            <p className="text-sm text-[#0088ff] dark:text-[#00d9ff] font-medium">
              Développé par Nefertiti Digital Solutions
            </p>
          </div>

          {/* Description de BudgetWise */}
          <Card className="mb-8 border-l-4 border-[#0088ff]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-[#0088ff]" />
                Qu'est-ce que BudgetWise ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong className="text-[#0088ff]">BudgetWise</strong> est une plateforme innovante de gestion financière personnelle 
                développée par <strong>Nefertiti Digital Solutions</strong>. Conçue pour les particuliers et les familles, 
                BudgetWise combine intelligence artificielle, gamification et une interface intuitive pour vous aider 
                à maîtriser vos finances, atteindre vos objectifs d'épargne et prendre de meilleures décisions financières.
              </p>
            </CardContent>
          </Card>

          {/* À propos de Nefertiti Digital Solutions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#0088ff]">
                Nefertiti Digital Solutions
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Mission */}
              <Card className="border-t-4 border-[#00d9ff]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-[#00d9ff]" />
                    Notre Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Concevoir des <strong>solutions numériques innovantes</strong> et accessibles 
                    destinées aux particuliers, aux entreprises et aux organisations. Nous transformons 
                    les défis quotidiens en opportunités digitales à travers des produits modernes, 
                    performants et centrés sur l'utilisateur.
                  </p>
                </CardContent>
              </Card>

              {/* Vision */}
              <Card className="border-t-4 border-[#0088ff]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5 text-[#0088ff]" />
                    Notre Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Devenir le <strong>leader africain</strong> des solutions digitales innovantes en proposant 
                    une gamme complète de produits qui améliorent la vie quotidienne et professionnelle de nos utilisateurs. 
                    BudgetWise est le premier produit de cet écosystème en constante évolution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Valeurs */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Nos Valeurs
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#0088ff] flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Innovation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Technologies de pointe et créativité au service de l'excellence
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#0088ff] flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Qualité</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Standards élevés et attention aux détails dans chaque produit
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#0088ff] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sécurité</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Protection des données et confidentialité garanties
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#0088ff] flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Excellence</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expérience utilisateur premium et satisfaction client
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Informations techniques */}
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-[#0088ff]">
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#0088ff] mb-1">v1.0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Version actuelle</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00d9ff] mb-1">2026</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Année de lancement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#0088ff] mb-1">PWA</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Application moderne</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00d9ff] mb-1">🇧🇫</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Made in Burkina Faso</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer de la page */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              <strong className="text-[#0088ff]">Innovating Digital Finance</strong>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2026 Nefertiti Digital Solutions. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
