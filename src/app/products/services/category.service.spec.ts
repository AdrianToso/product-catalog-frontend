import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategories: Category[] = [
    { id: '1', name: 'Category 1', description: 'Desc 1' },
    { id: '2', name: 'Category 2', description: 'Desc 2' },
  ];

  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all categories and log them', () => {
    service.getAllCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Solicitando categorías desde:',
        `${environment.apiUrl}Categories`
      );
      expect(consoleLogSpy).toHaveBeenCalledWith('Categorías recibidas:', mockCategories);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should handle error and log it', () => {
    const errorMessage = 'Failed to load';
    let errorResponse: any;

    service.getAllCategories().subscribe({
      next: () => {},
      error: err => (errorResponse = err),
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Categories`);
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });

    expect(errorResponse.status).toBe(500);
    expect(errorResponse.error.message).toBe(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error al obtener categorías:',
      expect.anything() // <- esto es seguro y funciona en Jest
    );
  });
});
