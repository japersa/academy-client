import { TestBed } from '@angular/core/testing';

import { AmaService } from './ama.service';

describe('AmaService', () => {
  let service: AmaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
