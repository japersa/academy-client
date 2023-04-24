import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalWithdrawalsComponent } from './global-withdrawals.component';

describe('GlobalWithdrawalsComponent', () => {
  let component: GlobalWithdrawalsComponent;
  let fixture: ComponentFixture<GlobalWithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalWithdrawalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
