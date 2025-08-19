import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from './models/product.model';
import { PaginatedResult } from './models/paginated-result.model';
import { environment } from '../../environments/environment';
import { CreateProductDto } from './models/create-product.dto';
import { UpdateProductDto } from './models/update-product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}Products`;

  constructor(private http: HttpClient) { }

  getProducts(pageNumber: number, pageSize: number): Observable<PaginatedResult<Product>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<Product>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  createProduct(product: CreateProductDto): Observable<string> {
    return this.http.post<string>(this.apiUrl, product)
      .pipe(catchError(this.handleError));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: string, product: UpdateProductDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: unknown): Observable<never> {
  console.error('API Error:', error);
  let errorMessage = 'Ocurrió un error inesperado.';
  
  // Manejo seguro de diferentes tipos de error
  if (typeof error === 'object' && error !== null) {
    const err = error as { error?: { title?: string }; message?: string };
    
    if (err.error?.title) {
      errorMessage = err.error.title;
    } else if (err.message) {
      errorMessage = err.message;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  return throwError(() => new Error(errorMessage));
}
}