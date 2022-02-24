import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourseByStepsComponent } from './create-course-by-steps.component';

describe('CreateCourseByStepsComponent', () => {
  let component: CreateCourseByStepsComponent;
  let fixture: ComponentFixture<CreateCourseByStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCourseByStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseByStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
