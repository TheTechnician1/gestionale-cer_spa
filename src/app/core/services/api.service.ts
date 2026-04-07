import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_SETTINGS } from "../config/app-settings";

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly baseUrl = APP_SETTINGS.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.get<T>(this.buildUrl(path), { params: this.buildParams(params) });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body);
  }

  delete<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path), { params: this.buildParams(params) });
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
