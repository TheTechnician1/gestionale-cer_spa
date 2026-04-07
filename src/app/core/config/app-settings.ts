export interface AppSettings {
  apiBaseUrl: string;
  i18nBasePath: string;
}

export const APP_SETTINGS: AppSettings = {
  apiBaseUrl: "https://api.example.com",
  i18nBasePath: "/assets/i18n",
};
