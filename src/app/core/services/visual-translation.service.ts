import { Injectable, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisualTranslationService {
  private observer?: MutationObserver;
  private applying = false;

  private readonly itToEn: Record<string, string> = {
    'Sezioni': 'Sections',
    'Dashboard': 'Dashboard',
    'CER': 'CER',
    'Ricerca CER': 'CER Search',
    'Nuova CER': 'New CER',
    'CER disattivate': 'Disabled CER',
    'Configurazioni': 'Configurations',
    'Ricerca configurazioni': 'Search configurations',
    'Nuova configurazione': 'New configuration',
    'Configurazioni disattivate': 'Disabled configurations',
    'Impianti': 'Plants',
    'Ricerca impianti': 'Search plants',
    'Nuovo impianto': 'New plant',
    'Dati energetici': 'Energy data',
    'Ricerca dati energetici': 'Search energy data',
    'Nuova scheda energetica': 'New energy sheet',
    'Impostazioni': 'Settings',
    'CER Gestionale': 'CER Management',
    'Notifiche': 'Notifications',
    'Profilo': 'Profile',
    'Log Out': 'Log out',
    'Logout': 'Log out',
    'Attenzione': 'Warning',
    'Sei sicuro di voler uscire? La sessione in corso potrebbe non essere stata salvata. Continuare?':
      'Are you sure you want to log out? The current session may not have been saved. Continue?',
    'Close': 'Close',
    'Chiudi': 'Close',
    'Annulla': 'Cancel',
    'Conferma': 'Confirm',
    'Salva': 'Save',
    'Indietro': 'Back',
    'Cerca': 'Search',
    'Pulisci filtri': 'Clear filters',
    'Aggiorna': 'Refresh',
    'Risultati': 'Results',
    'Ricerca in corso...': 'Searching...',
    'Caricamento in corso...': 'Loading...',
    'Caricamento configurazione...': 'Loading configuration...',
    'Caricamento impianto...': 'Loading plant...',
    'Filtro Ricerca CER': 'CER Search Filter',
    'Inserisci uno o piu criteri per filtrare le comunita energetiche':
      'Enter one or more criteria to filter energy communities',
    'Ragione Sociale': 'Company name',
    'Ragione sociale': 'Company name',
    'Partita IVA': 'VAT number',
    'Partita IVA CER': 'CER VAT number',
    'Scegli Forma Giuridica': 'Choose legal form',
    'Forma Giuridica': 'Legal form',
    'Forma giuridica': 'Legal form',
    'Specifiche forma giuridica': 'Legal form details',
    'Tutte': 'All',
    'Comune': 'Municipality',
    'Provincia': 'Province',
    'Regione': 'Region',
    'Codice fiscale': 'Tax code',
    'Codice Fiscale': 'Tax code',
    'Referente': 'Contact person',
    'Email': 'Email',
    'PEC': 'Certified email',
    'Sito web': 'Website',
    'Telefono': 'Phone',
    'Nome': 'First name',
    'Cognome': 'Last name',
    'Ruolo': 'Role',
    'Azioni': 'Actions',
    'Stato': 'Status',
    'Login': 'Login',
    'Inserisci le credenziali per accedere': 'Enter your credentials to sign in',
    'Email obbligatoria': 'Email is required',
    'Email non valida': 'Invalid email',
    'Password obbligatoria': 'Password is required',
    'Entra come ospite': 'Continue as guest',
    'Accedi': 'Sign in',
    'Registrazione Utente': 'User registration',
    'Inserisci i dati per creare un nuovo account': 'Enter the data to create a new account',
    'Numero di telefono': 'Phone number',
    'Conferma Password': 'Confirm password',
    'Il nome è obbligatorio': 'First name is required',
    'Il cognome è obbligatorio': 'Last name is required',
    "L'email è obbligatoria": 'Email is required',
    "Inserisci un'email valida": 'Enter a valid email',
    'Dati anagrafici': 'Registry data',
    'Informazioni identificative della comunita energetica':
      'Identifying information for the energy community',
    'Indirizzo e contatti': 'Address and contacts',
    'Recapiti operativi e sede principale': 'Operational contacts and main office',
    'Dettaglio CER': 'CER details',
    'CER non trovata': 'CER not found',
    "La CER selezionata non e presente nell'elenco disponibile.":
      'The selected CER is not present in the available list.',
    'Configurazioni cabina energetica': 'Energy substation configurations',
    'Configurazioni associate alla presente CER': 'Configurations associated with this CER',
    'Filtra per CER, identificativo, anno e codice cabina':
      'Filter by CER, identifier, year and substation code',
    'ID configurazione': 'Configuration ID',
    'ID CER': 'CER ID',
    'Codice cabina': 'Substation code',
    'Anno attivazione': 'Activation year',
    'Anno di attivazione': 'Activation year',
    'Anno attivazione da': 'Activation year from',
    'Anno attivazione a': 'Activation year to',
    'Visualizza configurazione': 'View configuration',
    'Modifica configurazione': 'Edit configuration',
    'Cancella configurazione': 'Delete configuration',
    'Dettaglio configurazione della CER': 'CER configuration details',
    'Impianti associati': 'Associated plants',
    'Impianti collegati alle configurazioni della CER': 'Plants linked to CER configurations',
    'Nessun impianto associato alla CER selezionata.': 'No plant associated with the selected CER.',
    'Nessuna configurazione associata alla CER selezionata.':
      'No configuration associated with the selected CER.',
    'Tipologia': 'Type',
    'Tipologia impianto': 'Plant type',
    'Categoria produttore': 'Producer category',
    'Data esercizio': 'Operation date',
    'Data entrata in esercizio': 'Operation start date',
    'Sito installazione': 'Installation site',
    'Dettaglio impianto associato alla CER': 'Details of the plant associated with the CER',
    'Visualizza dettaglio impianto': 'View plant details',
    'Modifica impianto': 'Edit plant',
    'Cancella impianto': 'Delete plant',
    'Elenco delle comunita energetiche rimosse': 'List of removed energy communities',
    'Nessuna CER disattivata trovata con i filtri selezionati.':
      'No disabled CER found with the selected filters.',
    'Elenco delle configurazioni rimosse logicamente': 'List of logically removed configurations',
    'Nessuna configurazione disattivata trovata con i filtri selezionati.':
      'No disabled configuration found with the selected filters.',
    'Lingua': 'Language',
    "Scegli la lingua dell'applicazione.": 'Choose the application language.',
    'Sessione': 'Session',
    "Esci dall'account corrente.": 'Log out of the current account.',
    'Gestisci lingua e sessione': 'Manage language and session',
    'Lingua aggiornata': 'Language updated',
    'Italiano': 'Italian',
    'English': 'English',
    'Apri/chiudi menu': 'Open/close menu',
    'Paginazione configurazioni': 'Configurations pagination',
    'Paginazione configurazioni disattivate': 'Disabled configurations pagination',
    'Paginazione impianti': 'Plants pagination',
    'Ricerca dati energetici annuali': 'Search annual energy data',
    'Filtra per cabina, CER, anno e stato della scheda':
      'Filter by substation, CER, year and sheet status',
    'Anno da': 'Year from',
    'Anno a': 'Year to',
    'Stato scheda': 'Sheet status',
    'Tutti': 'All',
    'Nuova scheda': 'New sheet',
    'Nessuna scheda energetica trovata.': 'No energy sheet found.',
    'Scheda energetica': 'Energy sheet',
    'Energia prodotta': 'Energy produced',
    'Energia prodotta MWh/anno': 'Energy produced MWh/year',
    'Energia prelevata': 'Energy withdrawn',
    'Energia prelevata MWh/anno': 'Energy withdrawn MWh/year',
    'Energia immessa': 'Energy fed in',
    'Energia immessa MWh/anno': 'Energy fed in MWh/year',
    'Energia condivisa': 'Shared energy',
    'Energia condivisa MWh/anno': 'Shared energy MWh/year',
    'Autoconsumo': 'Self-consumption',
    'Autoconsumo MWh/anno': 'Self-consumption MWh/year',
    'Prodotta MWh/anno': 'Produced MWh/year',
    'Condivisa MWh/anno': 'Shared MWh/year',
    'Riduzione CO2': 'CO2 reduction',
    'Riduzione emissioni CO2': 'CO2 emission reduction',
    'Tariffa premium': 'Premium tariff',
    'Tariffa premium euro': 'Premium tariff euro',
    'Corrispettivo premio': 'Optimized premium amount',
    'Corrispettivo premio euro': 'Optimized premium amount euro',
    'Modifica dati energetici': 'Edit energy data',
    'Nuovi dati energetici annuali': 'New annual energy data',
    'Valori energetici in MWh/anno e valori economici in euro':
      'Energy values in MWh/year and economic values in euros',
    'Caricamento scheda energetica...': 'Loading energy sheet...',
    'Anno di riferimento': 'Reference year',
    'Inserire un anno nel formato AAAA.': 'Enter a year in YYYY format.',
    'Inserire un numero intero non negativo.': 'Enter a non-negative integer.',
    'Inserire un importo non negativo.': 'Enter a non-negative amount.',
    'Calcolo automatico riduzione CO2': 'Automatic CO2 reduction calculation',
    'Fattore emissione CO2': 'CO2 emission factor',
    'Paginazione dati energetici': 'Energy data pagination',
    'Visualizza dettaglio configurazione cabina energetica':
      'View energy substation configuration details',
    'Modifica CER': 'Edit CER',
    'Elimina CER': 'Delete CER',
    'Select page of periodic elements': 'Select page',
  };

  private readonly enToIt = Object.entries(this.itToEn).reduce<Record<string, string>>(
    (acc, [it, en]) => {
      acc[en] = it;
      return acc;
    },
    {}
  );

  constructor(
    private translate: TranslateService,
    private router: Router,
    private zone: NgZone
  ) {}

  start(): void {
    this.zone.runOutsideAngular(() => {
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.scheduleApply(event.lang);
      });

      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => this.scheduleApply(this.translate.currentLang || 'it'));

      this.observer = new MutationObserver(() => {
        if (!this.applying) {
          this.scheduleApply(this.translate.currentLang || 'it');
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['placeholder', 'aria-label', 'title'],
      });

      this.scheduleApply(this.translate.currentLang || 'it');
    });
  }

  applyCurrentLanguage(): void {
    this.scheduleApply(this.translate.currentLang || 'it');
  }

  private scheduleApply(lang: string): void {
    window.setTimeout(() => this.apply(lang), 0);
  }

  private apply(lang: string): void {
    const map = lang === 'en' ? this.itToEn : this.enToIt;
    this.applying = true;

    this.translateElement(document.body, map);
    this.applying = false;
  }

  private translateElement(element: Element, map: Record<string, string>): void {
    if (this.shouldSkipElement(element)) {
      return;
    }

    this.translateAttributes(element, map);

    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        this.translateTextNode(node, map);
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        this.translateElement(node as Element, map);
      }
    });
  }

  private translateTextNode(node: Node, map: Record<string, string>): void {
    const value = node.textContent ?? '';
    const trimmed = value.trim();

    if (!trimmed || !map[trimmed]) {
      return;
    }

    node.textContent = value.replace(trimmed, map[trimmed]);
  }

  private translateAttributes(element: Element, map: Record<string, string>): void {
    ['placeholder', 'aria-label', 'title'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      const translated = value ? map[value.trim()] : null;

      if (translated) {
        element.setAttribute(attribute, translated);
      }
    });
  }

  private shouldSkipElement(element: Element): boolean {
    return ['SCRIPT', 'STYLE', 'MAT-ICON'].includes(element.tagName);
  }
}
