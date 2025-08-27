import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../services/loading.service';

// Mock para LoadingService
class MockLoadingService {
  show = jest.fn();
  hide = jest.fn();
}

describe('LoadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loadingService: MockLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true
        },
        { provide: LoadingService, useClass: MockLoadingService }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService) as unknown as MockLoadingService;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const interceptor = new LoadingInterceptor(loadingService as any);
    expect(interceptor).toBeTruthy();
  });

  it('should call show and hide methods on request', () => {
    httpClient.get('/test').subscribe();

    // Verificar que show fue llamado
    expect(loadingService.show).toHaveBeenCalled();


    // Verificar que hide fue llamado después de completar la solicitud
    expect(loadingService.hide).toHaveBeenCalled();
  });

  it('should handle multiple requests correctly', () => {
    // Realizar múltiples solicitudes
    httpClient.get('/test1').subscribe();
    httpClient.get('/test2').subscribe();

    expect(loadingService.show).toHaveBeenCalledTimes(2);

    const req1 = httpMock.expectOne('/test1');
    const req2 = httpMock.expectOne('/test2');

    req1.flush({});
    req2.flush({});

    expect(loadingService.hide).toHaveBeenCalledTimes(2);
  });
});

