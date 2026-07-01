# 🌍 Système de Tontines - Guide Complet

## Qu'est-ce qu'une Tontine ?

Une **tontine** est un système d'épargne collectif très populaire en Afrique où des membres se regroupent pour cotiser régulièrement. À chaque tour, un membre reçoit la totalité des contributions. C'est un moyen solidaire d'accumuler rapidement une somme importante.

## Fonctionnalités du Système

### 🎯 Caractéristiques Principales

- **Création de Tontines** : Créez et gérez plusieurs groupes de tontine
- **Gestion des Membres** : Ajoutez des membres avec leur position dans la rotation
- **Suivi des Contributions** : Enregistrez chaque paiement avec détails
- **Rotation Automatique** : Le système calcule automatiquement qui reçoit l'argent
- **Calendrier de Paiement** : Rappels pour les prochaines contributions
- **Statistiques Détaillées** : Vue d'ensemble de chaque tontine
- **Multi-Devises** : Support XOF, XAF, EUR, USD, etc.

### 📊 Gestion de Tontine

#### Création d'une Tontine

1. **Informations de Base**
   - Nom de la tontine (ex: "Tontine Amis 2025")
   - Description (optionnelle)
   - Nombre total de membres
   - Montant de la contribution par tour
   - Devise (XOF par défaut)

2. **Paramètres de Rotation**
   - Fréquence : Hebdomadaire, Bi-hebdomadaire, ou Mensuelle
   - Date de début
   - Règles spécifiques (optionnelles)

3. **Liste des Membres**
   - Nom du membre
   - Téléphone (optionnel)
   - Email (optionnel)
   - Position dans la rotation (1, 2, 3, ...)

#### Exemple de Configuration

```
Tontine: "Groupe Entrepreneuriat"
Membres: 10 personnes
Contribution: 50 000 XOF
Fréquence: Mensuelle
Date début: 1er janvier 2025

Tour 1 → Marie reçoit 500 000 XOF (10 × 50 000)
Tour 2 → Jean reçoit 500 000 XOF
...
Tour 10 → Paul reçoit 500 000 XOF
```

### 💰 Enregistrement des Contributions

Chaque tour, les membres cotisent :

- **Membre** : Qui a payé
- **Montant** : Somme versée
- **Tour** : Numéro du cycle actuel
- **Méthode** : Cash, Mobile Money, Virement
- **Notes** : Détails supplémentaires

### 🔄 Rotation Automatique

Le système détecte automatiquement quand :

1. ✅ Tous les membres ont payé pour un tour
2. 💰 Calcule le montant total à distribuer
3. 🎁 Attribue l'argent au membre dont c'est le tour
4. 📅 Programme le prochain paiement
5. 📊 Met à jour les statistiques

### 📈 Statuts des Tontines

- **ACTIVE** 🟢 : En cours, tours en progression
- **COMPLETED** 🔵 : Tous les tours terminés
- **PAUSED** 🟡 : Temporairement suspendue
- **CANCELLED** 🔴 : Annulée

## API Endpoints

### Tontines

```
GET    /api/v1/tontines              # Liste toutes les tontines
GET    /api/v1/tontines/:id          # Détails d'une tontine
POST   /api/v1/tontines              # Créer une tontine
PUT    /api/v1/tontines/:id          # Modifier une tontine
DELETE /api/v1/tontines/:id          # Supprimer une tontine
GET    /api/v1/tontines/:id/stats    # Statistiques
POST   /api/v1/tontines/:id/contributions  # Ajouter une contribution
```

### Exemple de Création

```json
POST /api/v1/tontines
{
  "name": "Tontine Quartier",
  "description": "Groupe d'épargne du quartier",
  "totalMembers": 12,
  "contributionAmount": 25000,
  "currency": "XOF",
  "frequency": "MONTHLY",
  "startDate": "2025-01-01",
  "members": [
    {
      "name": "Fatou Diop",
      "phone": "+221771234567",
      "position": 1
    },
    {
      "name": "Mamadou Sow",
      "phone": "+221779876543",
      "position": 2
    }
    // ... 10 autres membres
  ]
}
```

### Exemple de Contribution

```json
POST /api/v1/tontines/:id/contributions
{
  "memberId": "uuid-du-membre",
  "amount": 25000,
  "round": 1,
  "paymentMethod": "MOBILE_MONEY",
  "notes": "Paiement via Wave"
}
```

## Base de Données

### Tables

#### `tontines`
- Informations principales de la tontine
- Statut, montants, fréquence
- Dates de début/fin
- Tour actuel

#### `tontine_members`
- Membres de chaque tontine
- Position dans la rotation
- Montant total payé
- Statut de réception

#### `tontine_contributions`
- Historique des paiements
- Montant, tour, méthode
- Notes et détails

#### `tontine_rotations`
- Enregistrement des distributions
- Qui a reçu quand
- Montant total distribué

## Avantages du Système

### Pour les Utilisateurs

1. **Épargne Forcée** 💪
   - Engagement régulier
   - Objectif clair

2. **Somme Importante** 💰
   - Accumulation rapide
   - Sans intérêts à payer

3. **Solidarité** 🤝
   - Entraide communautaire
   - Renforcement des liens

4. **Transparence** 🔍
   - Suivi en temps réel
   - Historique complet

### Pour BudgetWise

1. **Différenciation** ⭐
   - Feature unique en Afrique
   - Aucun concurrent direct

2. **Engagement** 📈
   - Utilisation régulière
   - Notifications fréquentes

3. **Viralité** 🌟
   - Invitation de membres
   - Croissance organique

4. **Culturel** 🌍
   - Adapté au contexte africain
   - Besoins réels

## Cas d'Usage

### 1. Tontine Familiale
- **Membres** : 8 membres de la famille
- **Montant** : 100 000 XOF
- **Fréquence** : Mensuelle
- **But** : Aider chacun à tour de rôle

### 2. Tontine Professionnelle
- **Membres** : 15 collègues
- **Montant** : 50 000 XOF
- **Fréquence** : Bi-hebdomadaire
- **But** : Projets personnels

### 3. Tontine Association
- **Membres** : 20 membres
- **Montant** : 20 000 XOF
- **Fréquence** : Hebdomadaire
- **But** : Renforcement communautaire

## Prochaines Améliorations

### Phase 2 (À venir)

- [ ] **Notifications Push** : Rappels de paiement
- [ ] **Pénalités** : Gestion des retards
- [ ] **Multi-Admin** : Plusieurs gestionnaires
- [ ] **Chat Groupe** : Communication interne
- [ ] **Vote** : Décisions collectives
- [ ] **Export PDF** : Rapport de tontine
- [ ] **QR Code** : Paiement mobile facilité
- [ ] **Recommandations** : Membres suggérés

## Support

La tontine est un pilier de l'épargne africaine. BudgetWise le digitalise pour le rendre :
- Plus transparent
- Plus facile à gérer
- Accessible partout
- Traçable et sécurisé

**C'est LA fonctionnalité qui nous démarque de tous les autres budgets apps ! 🚀**
