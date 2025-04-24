import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'api/ai'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  findCandidates(searchParams: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/find-candidates`, searchParams)
      .pipe(
        catchError(this.handleError('findCandidates', { candidates: [], totalCount: 0 }))
      );
  }

  saveSearch(searchData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save-search`, searchData)
      .pipe(
        catchError(this.handleError('saveSearch', {}))
      );
  }

  getSuggestions(searchText: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions?q=${encodeURIComponent(searchText)}`)
      .pipe(
        catchError(this.handleError<string[]>('getSuggestions', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Return an empty result to keep the application running
      return of(result as T);
    };
  }
}