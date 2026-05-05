import { Injectable } from "@angular/core";
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_SETTINGS } from "../config/app-settings";

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly baseUrl = APP_SETTINGS.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(
    path: string,
    params?: Record<string, string | number | boolean>,
    context?: HttpContext
  ): Observable<T> {
    return this.request<T>('GET', path, {
      params: this.buildParams(params),
      context,
    });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.request<T>('POST', path, body);
  }

  postText(path: string, body: any): Observable<string> {
    return this.request('POST', path, body, 'text');
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.request<T>('PUT', path, body);
  }

  putDelete<T>(path: string, body: any): Observable<T> {
    return this.request<T>('PUT', path, body);
  }

  putText(path: string, body: any): Observable<string> {
    return this.request('PUT', path, body, 'text');
  }

  delete<T>(path: string, params?: any): Observable<T> {
    return this.request<T>('DELETE', path, { params });
  }

private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: any,
    responseType: 'json' | 'text' = 'json',
    params?: Record<string, any>
  ): Observable<any> {

    const url = this.buildUrl(path);

    const options: any = {
      body,
      params: this.buildParams(params),
      responseType
    };

    switch (method) {
      case 'GET':
        return this.http.get<T>(url, body);
      case 'POST':
        return this.http.post<T>(url, body, options);
      case 'PUT':
        return this.http.put<T>(url, body, options);
      case 'DELETE':
        return this.http.delete<T>(url, options);
    }
  }

  private buildUrl(path: string): string {
    const trimmedBase = this.baseUrl.replace(/\/+$/, "");
    const trimmedPath = path.replace(/^\/+/, "");
    return `${trimmedBase}/${trimmedPath}`;
  }

  private buildParams(params?: Record<string, string | number | boolean | null>): HttpParams | undefined {
    if (!params) return undefined;
    return Object.entries(params).reduce((acc, [key, value]) => acc.set(key, String(value)), new HttpParams());
  }
}
