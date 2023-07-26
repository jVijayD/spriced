import { TestBed } from '@angular/core/testing';

import { ModelAccessService } from './model-access.service';

describe('ModelAccessService', () => {
  let service: ModelAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
