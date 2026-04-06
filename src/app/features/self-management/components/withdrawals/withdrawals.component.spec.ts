import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { UserService } from 'src/app/shared/services/user.service';
import { WithdrawalsComponent } from './withdrawals.component';

describe('WithdrawalsComponent', () => {
  let component: WithdrawalsComponent;
  let fixture: ComponentFixture<WithdrawalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawalsComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: () => of({ commission_balance: 0 }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
