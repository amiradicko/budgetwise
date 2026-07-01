export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Espèces', icon: '💵' },
  { value: 'CARD', label: 'Carte bancaire', icon: '💳' },
  { value: 'BANK_TRANSFER', label: 'Virement bancaire', icon: '🏦' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money', icon: '📱' },
  { value: 'CHECK', label: 'Chèque', icon: '📝' },
  { value: 'OTHER', label: 'Autre', icon: '💰' },
] as const;

export const MOBILE_MONEY_PROVIDERS = [
  { value: 'ORANGE_MONEY', label: 'Orange Money', color: '#FF6600' },
  { value: 'MOOV_MONEY', label: 'Moov Money', color: '#009EDB' },
  { value: 'WAVE', label: 'Wave', color: '#00B6DE' },
  { value: 'MTN_MONEY', label: 'MTN Money', color: '#FFCC00' },
] as const;
