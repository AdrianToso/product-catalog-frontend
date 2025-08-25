import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}Categories`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    console.log('Solicitando categorías desde:', this.apiUrl);
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap(categories => console.log('Categorías recibidas:', categories)),
      catchError(error => {
        console.error('Error al obtener categorías:', error);
        throw error;
      })
    );
  }
}