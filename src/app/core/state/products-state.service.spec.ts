import { TestBed } from '@angular/core/testing';

import { ProductsStateService } from './products-state.service';

describe('ProductsStateService', () => {
  let service: ProductsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
