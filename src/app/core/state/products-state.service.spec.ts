import { TestBed } from '@angular/core/testing';
import { ProductsStateService } from './products-state.service';
import { Product, Category } from '../../products/models/product.model';

describe('ProductsStateService', () => {
  let service: ProductsStateService;

  const mockCategory: Category = {
    id: 'cat-123',
    name: 'Electronics',
    description: 'Category description',
  };

  const mockProduct1: Product = {
    id: 'prod-123',
    name: 'Product 1',
    description: 'Test Description 1',
    imageUrl: 'image1.jpg',
    category: mockCategory,
  };

  const mockProduct2: Product = {
    id: 'prod-456',
    name: 'Product 2',
    description: 'Test Description 2',
    imageUrl: 'image2.jpg',
    category: mockCategory,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get products', done => {
    service.setProducts([mockProduct1, mockProduct2]);
    service.products$.subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toContain(mockProduct1);
      expect(products).toContain(mockProduct2);
      done();
    });
  });

  it('should add a product', done => {
    service.setProducts([]);
    service.addProduct(mockProduct1);
    service.products$.subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0]).toBe(mockProduct1);
      done();
    });
  });

  it('should update a product', done => {
    const updatedProduct = { ...mockProduct1, name: 'Updated Product 1' };
    service.setProducts([mockProduct1]);
    service.updateProduct(updatedProduct);
    service.products$.subscribe(products => {
      expect(products[0].name).toBe('Updated Product 1');
      done();
    });
  });

  it('should remove a product', done => {
    service.setProducts([mockProduct1, mockProduct2]);
    service.removeProduct(mockProduct1.id);
    service.products$.subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0]).toBe(mockProduct2);
      done();
    });
  });

  it('should set and get loading state', done => {
    service.setLoading(true);
    service.loading$.subscribe(loading => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('should set and get error state', done => {
    service.setError('Test error');
    service.error$.subscribe(error => {
      expect(error).toBe('Test error');
      done();
    });
  });

  it('should set and get pagination', done => {
    service.setPagination(2, 20, 100);
    service.pagination$.subscribe(pagination => {
      expect(pagination.page).toBe(2);
      expect(pagination.pageSize).toBe(20);
      expect(pagination.totalCount).toBe(100);
      done();
    });
  });
});
