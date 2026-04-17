export interface AppSettings {
  apiBaseUrl: string;
  i18nBasePath: string;
}

export const APP_SETTINGS: AppSettings = {
  apiBaseUrl: "http://localhost:8081/",
  i18nBasePath: "/assets/i18n",
};
