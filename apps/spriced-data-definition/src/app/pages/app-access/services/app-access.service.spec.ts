import { TestBed } from '@angular/core/testing';

import { AppAccessService } from './app-access.service';

describe('AppAccessService', () => {
  let service: AppAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
