import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PurchaseRequest {
  productId: string;
  quantity: number;
  userId?: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}Purchase`;

  constructor(private http: HttpClient) { }

  purchaseProduct(purchaseRequest: PurchaseRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(this.apiUrl, purchaseRequest);
  }

  // Método para compras rápidas (simplificado)
quickPurchase(productId: string, quantity: number = 1): Observable<PurchaseResponse> {
  const purchaseRequest: PurchaseRequest = {
    productId,
    quantity
  };
  
  return this.purchaseProduct(purchaseRequest);
}
}