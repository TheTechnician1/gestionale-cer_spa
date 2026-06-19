import { Injectable, signal } from '@angular/core';
import { Category, Product, Tag } from '../models';
import { readStorage, writeStorage } from '../storage';

export type Lang = 'it' | 'en' | 'fr';

type Dictionary = Record<string, string>;

const dictionaries: Record<Lang, Dictionary> = {
  it: {
    home: 'Home',
    products: 'Prodotti',
    categories: 'Categorie',
    about: 'About us',
    support: 'Supporto',
    addToCart: 'Aggiungi al carrello',
    buyNow: 'Compra ora',
    checkout: 'Checkout',
    signIn: 'Accedi',
    account: 'Account',
    cart: 'Carrello',
    heroTitle: 'Videa Factory',
    heroText: 'Il toolkit digitale premium per velocizzare workflow, template e asset nei progetti video.',
    featured: 'Prodotti in evidenza',
    why: 'Why Videa Factory',
    features: 'Funzionalita principali',
    faq: 'FAQ',
    finalCta: 'Porta ordine e velocita nel tuo montaggio.',
    productsTitle: 'Prodotti',
    allProducts: 'Tutti i prodotti',
    categoriesTitle: 'Categorie',
    category: 'Categoria',
    categoryFilter: 'Filtro categoria',
    sortBy: 'Ordina per',
    custom: 'Personalizzato',
    newest: 'Piu recenti',
    highestRated: 'Miglior valutazione',
    mostReviewed: 'Piu recensiti',
    priceLowHigh: 'Prezzo crescente',
    priceHighLow: 'Prezzo decrescente',
    tags: 'Tag',
    searchTag: 'Cerca tag',
    compatibility: 'Compatibilita',
    price: 'Prezzo',
    minimumPrice: 'Prezzo minimo',
    maximumPrice: 'Prezzo massimo',
    lifetime: 'Lifetime',
    subscription: 'Abbonamento',
    purchaseType: 'Tipo acquisto',
    noProducts: 'Nessun prodotto trovato',
    profileOverview: 'Panoramica profilo',
    accountSettings: 'Impostazioni account',
    orders: 'Ordini',
    licensesDownloads: 'Licenze e download',
    billing: 'Fatturazione',
    preferences: 'Preferenze',
    security: 'Sicurezza',
    adminShortcut: 'Scorciatoia admin',
    saveChanges: 'Salva modifiche',
    changePassword: 'Cambia password',
    viewDetails: 'Vedi dettagli',
    download: 'Download',
    copyLicense: 'Copia licenza',
    active: 'Attivo',
    noSubscriptionRequired: 'Nessun abbonamento attivo richiesto',
    manageConnectedAccounts: 'Gestisci account collegati',
    adminDashboard: 'Dashboard admin',
    supportQuestion: 'Come possiamo aiutarti?',
    joined: 'Iscritto',
    name: 'Nome',
    paymentMethod: 'Metodo di pagamento',
    cardEnding: 'Carta finale',
    billingEmail: 'Email fatturazione',
    language: 'Lingua',
    currency: 'Valuta',
    lastLogin: 'Ultimo accesso',
    loginProvider: 'Provider login',
    completed: 'Completato',
    search: 'Cerca',
    showingOf: 'di',
    showAdvancedFilters: 'Mostra filtri avanzati',
    hideAdvancedFilters: 'Nascondi filtri avanzati',
    clearFiltersHint: 'Prova a rimuovere ricerca o filtri avanzati.',
    all: 'Tutto',
    discountCode: 'Codice sconto',
    apply: 'Applica',
    removeDiscount: 'Rimuovi sconto',
    invalidCode: 'Codice non valido',
    codeExpired: 'Codice scaduto',
    codeApplied: 'Codice applicato',
    sale: 'Saldo',
    endsIn: 'Termina tra',
    originalPrice: 'Prezzo originale',
    discountedPrice: 'Prezzo scontato',
    images: 'Immagini',
    videos: 'Video',
    tutorial: 'Tutorial',
    productMedia: 'Media prodotto',
    specificProduct: 'Prodotto specifico',
    specificCategory: 'Categoria specifica',
    inactive: 'Inattivo',
    percentage: 'Percentuale',
    fixedAmount: 'Importo fisso',
    saleDiscount: 'Sconto saldo',
    finalTotal: 'Totale finale',
    aboutTitle: 'Tool di workflow e automazione per creator, editor e team digitali.',
    aboutBody: 'Videa crea strumenti di workflow, automazione e produttivita per rendere la produzione creativa piu veloce, pulita e scalabile. Accanto ai tool digitali, Videa puo supportare clienti selezionati anche con servizi marketing e contenuti.',
    emptyCart: 'Il carrello e vuoto.',
    completePurchase: 'Completa acquisto',
    orderSuccess: 'Acquisto completato',
    accessDenied: 'Accesso negato'
    ,currentPassword: 'Password attuale'
    ,newPassword: 'Nuova password'
    ,confirmNewPassword: 'Conferma nuova password'
    ,updatePassword: 'Aggiorna password'
    ,backToAccount: 'Torna all account'
    ,minPasswordMessage: 'Usa almeno 8 caratteri.'
    ,passwordsDoNotMatch: 'Le password non corrispondono.'
    ,passwordUpdated: 'Password aggiornata correttamente.'
  },
  en: {
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    about: 'About us',
    support: 'Support',
    addToCart: 'Add to cart',
    buyNow: 'Buy now',
    checkout: 'Checkout',
    signIn: 'Sign in',
    account: 'Account',
    cart: 'Cart',
    heroTitle: 'Videa Factory',
    heroText: 'The premium digital toolkit for faster video workflows, templates and editing assets.',
    featured: 'Featured products',
    why: 'Why Videa Factory',
    features: 'Core features',
    faq: 'FAQ',
    finalCta: 'Bring order and speed to your editing workflow.',
    productsTitle: 'Products',
    allProducts: 'All products',
    categoriesTitle: 'Categories',
    category: 'Category',
    categoryFilter: 'Category filter',
    sortBy: 'Sort by',
    custom: 'Custom',
    newest: 'Newest',
    highestRated: 'Highest rated',
    mostReviewed: 'Most reviewed',
    priceLowHigh: 'Price (Low to High)',
    priceHighLow: 'Price (High to Low)',
    tags: 'Tags',
    searchTag: 'Search tag',
    compatibility: 'Compatibility',
    price: 'Price',
    minimumPrice: 'Minimum price',
    maximumPrice: 'Maximum price',
    lifetime: 'Lifetime',
    subscription: 'Subscription',
    purchaseType: 'Purchase type',
    noProducts: 'No products found',
    profileOverview: 'Profile overview',
    accountSettings: 'Account settings',
    orders: 'Orders',
    licensesDownloads: 'Licenses & downloads',
    billing: 'Billing',
    preferences: 'Preferences',
    security: 'Security',
    adminShortcut: 'Admin shortcut',
    saveChanges: 'Save changes',
    changePassword: 'Change password',
    viewDetails: 'View details',
    download: 'Download',
    copyLicense: 'Copy license key',
    active: 'Active',
    noSubscriptionRequired: 'No active subscription required',
    manageConnectedAccounts: 'Manage connected accounts',
    adminDashboard: 'Admin dashboard',
    supportQuestion: 'How can we help?',
    joined: 'Joined',
    name: 'Name',
    paymentMethod: 'Payment method',
    cardEnding: 'Card ending',
    billingEmail: 'Billing email',
    language: 'Language',
    currency: 'Currency',
    lastLogin: 'Last login',
    loginProvider: 'Login provider',
    completed: 'Completed',
    search: 'Search',
    showingOf: 'of',
    showAdvancedFilters: 'Show advanced filters',
    hideAdvancedFilters: 'Hide advanced filters',
    clearFiltersHint: 'Try clearing search or advanced filters.',
    all: 'All',
    discountCode: 'Discount code',
    apply: 'Apply',
    removeDiscount: 'Remove discount',
    invalidCode: 'Invalid code',
    codeExpired: 'Code expired',
    codeApplied: 'Code applied',
    sale: 'Sale',
    endsIn: 'Ends in',
    originalPrice: 'Original price',
    discountedPrice: 'Discounted price',
    images: 'Images',
    videos: 'Videos',
    tutorial: 'Tutorial',
    productMedia: 'Product media',
    specificProduct: 'Specific product',
    specificCategory: 'Specific category',
    inactive: 'Inactive',
    percentage: 'Percentage',
    fixedAmount: 'Fixed amount',
    saleDiscount: 'Sale discount',
    finalTotal: 'Final total',
    aboutTitle: 'Workflow and automation tools for creators, editors and digital teams.',
    aboutBody: 'Videa builds workflow, automation and productivity tools that make creative production faster, cleaner and easier to scale. Alongside our digital tools, Videa can also support selected clients through marketing and content services.',
    emptyCart: 'Your cart is empty.',
    completePurchase: 'Complete purchase',
    orderSuccess: 'Purchase complete',
    accessDenied: 'Access denied'
    ,currentPassword: 'Current password'
    ,newPassword: 'New password'
    ,confirmNewPassword: 'Confirm new password'
    ,updatePassword: 'Update password'
    ,backToAccount: 'Back to account'
    ,minPasswordMessage: 'Use at least 8 characters.'
    ,passwordsDoNotMatch: 'Passwords do not match.'
    ,passwordUpdated: 'Password updated successfully.'
  },
  fr: {
    home: 'Accueil',
    products: 'Produits',
    categories: 'Categories',
    about: 'About us',
    support: 'Support',
    addToCart: 'Ajouter au panier',
    buyNow: 'Acheter',
    checkout: 'Paiement',
    signIn: 'Connexion',
    account: 'Compte',
    cart: 'Panier',
    heroTitle: 'Videa Factory',
    heroText: 'Le toolkit digital premium pour accelerer vos workflows video, templates et assets.',
    featured: 'Produits en vedette',
    why: 'Why Videa Factory',
    features: 'Fonctionnalites cles',
    faq: 'FAQ',
    finalCta: 'Ajoutez ordre et vitesse a votre montage.',
    productsTitle: 'Produits',
    allProducts: 'Tous les produits',
    categoriesTitle: 'Categories',
    category: 'Categorie',
    categoryFilter: 'Filtre categorie',
    sortBy: 'Trier par',
    custom: 'Personnalise',
    newest: 'Plus recent',
    highestRated: 'Mieux note',
    mostReviewed: 'Plus commente',
    priceLowHigh: 'Prix croissant',
    priceHighLow: 'Prix decroissant',
    tags: 'Tags',
    searchTag: 'Rechercher un tag',
    compatibility: 'Compatibilite',
    price: 'Prix',
    minimumPrice: 'Prix minimum',
    maximumPrice: 'Prix maximum',
    lifetime: 'Lifetime',
    subscription: 'Abonnement',
    purchaseType: 'Type d achat',
    noProducts: 'Aucun produit trouve',
    profileOverview: 'Vue du profil',
    accountSettings: 'Parametres du compte',
    orders: 'Commandes',
    licensesDownloads: 'Licences et telechargements',
    billing: 'Facturation',
    preferences: 'Preferences',
    security: 'Securite',
    adminShortcut: 'Raccourci admin',
    saveChanges: 'Enregistrer',
    changePassword: 'Changer le mot de passe',
    viewDetails: 'Voir details',
    download: 'Telecharger',
    copyLicense: 'Copier la cle',
    active: 'Actif',
    noSubscriptionRequired: 'Aucun abonnement actif requis',
    manageConnectedAccounts: 'Gerer les comptes connectes',
    adminDashboard: 'Dashboard admin',
    supportQuestion: 'Comment pouvons-nous aider ?',
    joined: 'Inscrit',
    name: 'Nom',
    paymentMethod: 'Methode de paiement',
    cardEnding: 'Carte finissant par',
    billingEmail: 'Email de facturation',
    language: 'Langue',
    currency: 'Devise',
    lastLogin: 'Derniere connexion',
    loginProvider: 'Fournisseur de connexion',
    completed: 'Confirmee',
    search: 'Rechercher',
    showingOf: 'sur',
    showAdvancedFilters: 'Afficher les filtres avances',
    hideAdvancedFilters: 'Masquer les filtres avances',
    clearFiltersHint: 'Essayez de retirer la recherche ou les filtres avances.',
    all: 'Tous',
    discountCode: 'Code promo',
    apply: 'Appliquer',
    removeDiscount: 'Retirer le code',
    invalidCode: 'Code invalide',
    codeExpired: 'Code expire',
    codeApplied: 'Code applique',
    sale: 'Promo',
    endsIn: 'Se termine dans',
    originalPrice: 'Prix original',
    discountedPrice: 'Prix reduit',
    images: 'Images',
    videos: 'Videos',
    tutorial: 'Tutoriel',
    productMedia: 'Media produit',
    specificProduct: 'Produit specifique',
    specificCategory: 'Categorie specifique',
    inactive: 'Inactif',
    percentage: 'Pourcentage',
    fixedAmount: 'Montant fixe',
    saleDiscount: 'Reduction promo',
    finalTotal: 'Total final',
    aboutTitle: 'Outils de workflow et d automatisation pour createurs, monteurs et equipes digitales.',
    aboutBody: 'Videa cree des outils de workflow, d automatisation et de productivite pour rendre la production creative plus rapide, plus claire et plus facile a faire evoluer. En complement de ses outils digitaux, Videa peut aussi accompagner certains clients avec des services marketing et contenu.',
    emptyCart: 'Votre panier est vide.',
    completePurchase: 'Finaliser',
    orderSuccess: 'Achat confirme',
    accessDenied: 'Acces refuse'
    ,currentPassword: 'Mot de passe actuel'
    ,newPassword: 'Nouveau mot de passe'
    ,confirmNewPassword: 'Confirmer le nouveau mot de passe'
    ,updatePassword: 'Mettre a jour le mot de passe'
    ,backToAccount: 'Retour au compte'
    ,minPasswordMessage: 'Utilisez au moins 8 caracteres.'
    ,passwordsDoNotMatch: 'Les mots de passe ne correspondent pas.'
    ,passwordUpdated: 'Mot de passe mis a jour.'
  }
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly language = signal<Lang>(readStorage<Lang>('videa_language', 'it'));

  setLanguage(lang: Lang): void {
    this.language.set(lang);
    writeStorage('videa_language', lang);
  }

  t(key: string): string {
    return dictionaries[this.language()][key] ?? key;
  }

  productName(product: Product): string {
    const lang = this.translationLang();
    return lang ? product.translations?.[lang]?.name ?? product.name : product.name;
  }

  productShort(product: Product): string {
    const lang = this.translationLang();
    return lang ? product.translations?.[lang]?.shortDescription ?? product.shortDescription : product.shortDescription;
  }

  productDescription(product: Product): string {
    const lang = this.translationLang();
    return lang ? product.translations?.[lang]?.description ?? product.description : product.description;
  }

  categoryName(category: Category): string {
    const lang = this.translationLang();
    return lang ? category.translations?.[lang]?.name ?? category.name : category.name;
  }

  categoryDescription(category: Category): string {
    const lang = this.translationLang();
    return lang ? category.translations?.[lang]?.description ?? category.description : category.description;
  }

  tagName(tag: Tag): string {
    const lang = this.translationLang();
    return lang ? tag.translations?.[lang] ?? tag.name : tag.name;
  }

  purchaseType(type: 'subscription' | 'lifetime'): string {
    return type === 'subscription' ? this.t('subscription') : this.t('lifetime');
  }

  private translationLang(): 'it' | 'fr' | null {
    const lang = this.language();
    return lang === 'it' || lang === 'fr' ? lang : null;
  }
}
