import { TestBed, inject } from '@angular/core/testing';

import { DateProviderService } from './date-provider.service';

describe('DateProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateProviderService]
    });
  });

  it('should be created', inject([DateProviderService], (service: DateProviderService) => {
    expect(service).toBeTruthy();
  }));
});
