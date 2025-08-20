import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 
import { Product } from '../../products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsStateService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private paginationSubject = new BehaviorSubject<{page: number, pageSize: number, totalCount: number}>({
    page: 1,
    pageSize: 10,
    totalCount: 0
  });

  // Observables públicos
  products$ = this.productsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  pagination$ = this.paginationSubject.asObservable();

  // Actualizar estado
  setProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  setPagination(page: number, pageSize: number, totalCount: number): void {
    this.paginationSubject.next({ page, pageSize, totalCount });
  }

  // Métodos de utilidad
  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, product]);
  }

  updateProduct(updatedProduct: Product): void {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    
    if (index !== -1) {
      const newProducts = [...currentProducts];
      newProducts[index] = updatedProduct;
      this.productsSubject.next(newProducts);
    }
  }

  removeProduct(productId: string): void {
    const currentProducts = this.productsSubject.value;
    const filteredProducts = currentProducts.filter(p => p.id !== productId);
    this.productsSubject.next(filteredProducts);
  }
}