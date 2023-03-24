import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRouteComponent } from './current-route.component';

describe('CurrentRouteComponent', () => {
  let component: CurrentRouteComponent;
  let fixture: ComponentFixture<CurrentRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentRouteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
