import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import { CreateProductDto } from './models/create-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}Products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create product with image using FormData', () => {
    const mockResponse = 'product-id-123';
    const productData: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      categoryId: 'cat-123'
    };
    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    service.createProductWithImage(productData, imageFile).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/with-image`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(mockResponse);
  });

  it('should update product image', () => {
    const productId = '123';
    const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

    service.updateProductImage(productId, imageFile).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${productId}/image`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    req.flush(null);
  });
});