import { TestBed, inject } from '@angular/core/testing';

import { ProfanityService } from './profanity.service';

describe('ProfanityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfanityService]
    });
  });

  it('should be created', inject([ProfanityService], (service: ProfanityService) => {
    expect(service).toBeTruthy();
  }));
});
