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

    // opcional: validar que los campos de FormData estén presentes
    const formData = req.request.body as FormData;
    expect(formData.get('Name')).toBe(productData.name);
    expect(formData.get('Description')).toBe(productData.description);
    expect(formData.get('CategoryId')).toBe(productData.categoryId);
    expect(formData.get('ImageFile')).toBe(imageFile);

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

  it('should handle error responses', () => {
    const productId = 'non-existent';

    service.getProductById(productId).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err).toBeTruthy();
        expect(err.message).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/${productId}`);
    req.flush({ title: 'Not Found' }, { status: 404, statusText: 'Not Found' });
  });

  it('should get products with pagination', () => {
    const mockPaginated = {
      items: [],
      totalCount: 0
    };

    service.getProducts(1, 10).subscribe(response => {
      expect(response).toEqual(mockPaginated);
    });

    const req = httpMock.expectOne(`${apiUrl}?pageNumber=1&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginated);
  });

  it('should create product without image', () => {
    const mockResponse = 'product-id-456';
    const productData: CreateProductDto = {
      name: 'No Image Product',
      description: 'Description',
      categoryId: 'cat-456'
    };

    service.createProduct(productData).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(productData);
    req.flush(mockResponse);
  });
});
