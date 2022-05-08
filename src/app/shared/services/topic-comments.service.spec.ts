import { TestBed } from '@angular/core/testing';

import { TopicCommentsService } from './topic-comments.service';

describe('TopicCommentsService', () => {
  let service: TopicCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
