import { Injectable } from "@angular/core";
import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_SETTINGS } from "../config/app-settings";
import { StorageService } from "./storage.service";
import { SKIP_HTTP_SNACKBAR } from "../interceptor/http-status/http-snackbar.context";

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean>;
  skipToast?: boolean;
  responseType?: "json" | "text";
}

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly baseUrl = APP_SETTINGS.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private api: StorageService,
  ) {}

  get<T>(path: string, params?: Record<string, string | number | boolean>, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>("GET", path, undefined, "json", { ...options, params });
  }

  getText(path: string, params?: Record<string, string | number | boolean>) {
    return this.request<string>("GET", path, undefined, "text", { params });
  }

  post<T>(path: string, body: any, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>("POST", path, body, options.responseType === 'text' ? 'text' : 'json', options);
  }

  put<T>(path: string, body: any, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>("PUT", path, body, "json", options);
  }

  delete<T>(path: string, params?: Record<string, string | number | boolean>, options: ApiRequestOptions = {}): Observable<T> {
    return this.request<T>("DELETE", path, undefined, "json", { ...options, params });
  }

  private request<T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: any, responseType: "json" | "text" = "json", options: ApiRequestOptions = {}): Observable<T> {
    const url = this.buildUrl(path);
    const context = new HttpContext().set(SKIP_HTTP_SNACKBAR, options.skipToast ?? false);
    const params = this.buildParams(options.params);

    if (responseType === "text") {
      const textOptions = {
        context,
        params,
        responseType: "text" as const,
      };

      switch (method) {
        case "GET":
          return this.http.get(url, textOptions) as Observable<T>;
        case "POST":
          return this.http.post(url, body, textOptions) as Observable<T>;
        case "PUT":
          return this.http.put(url, body, textOptions) as Observable<T>;
        case "DELETE":
          return this.http.delete(url, textOptions) as Observable<T>;
        default:
          throw new Error(`Metodo HTTP non supportato: ${method}`);
      }


    }

    const jsonOptions = {
      context,
      params,
      responseType: "json" as const,
    };

    switch (method) {
      case "GET":
        return this.http.get<T>(url, jsonOptions);
      case "POST":
        return this.http.post<T>(url, body, jsonOptions);
      case "PUT":
        return this.http.put<T>(url, body, jsonOptions);
      case "DELETE":
        return this.http.delete<T>(url, jsonOptions);
    }

    throw new Error(`Metodo HTTP non supportato: ${method}`);
  }

  private buildUrl(path: string): string {
    const trimmedBase = this.baseUrl.replace(/\/+$/, "");
    const trimmedPath = path.replace(/^\/+/, "");
    return `${trimmedBase}/${trimmedPath}`;
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams | undefined {
    if (!params) return undefined;
    return Object.entries(params).reduce((acc, [key, value]) => acc.set(key, String(value)), new HttpParams());
  }
}
