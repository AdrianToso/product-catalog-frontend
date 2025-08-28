import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PurchaseService, PurchaseRequest, PurchaseResponse } from './purchase.service';
import { environment } from '../../../environments/environment';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PurchaseService],
    });
    service = TestBed.inject(PurchaseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('purchaseProduct should POST to API and return response', () => {
    const mockRequest: PurchaseRequest = { productId: 'p1', quantity: 2 };
    const mockResponse: PurchaseResponse = { success: true, message: 'OK', orderId: '123' };

    service.purchaseProduct(mockRequest).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}Purchase`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('quickPurchase should call purchaseProduct with defaults', () => {
    const spy = jest.spyOn(service, 'purchaseProduct').mockReturnValue({
      subscribe: jest.fn(),
    } as any);

    service.quickPurchase('p1');

    expect(spy).toHaveBeenCalledWith({ productId: 'p1', quantity: 1 });
  });

  it('quickPurchase should call purchaseProduct with custom quantity', () => {
    const spy = jest.spyOn(service, 'purchaseProduct').mockReturnValue({
      subscribe: jest.fn(),
    } as any);

    service.quickPurchase('p1', 5);

    expect(spy).toHaveBeenCalledWith({ productId: 'p1', quantity: 5 });
  });
});
