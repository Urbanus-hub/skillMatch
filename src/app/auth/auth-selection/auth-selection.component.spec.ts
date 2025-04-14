import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSelectionComponent } from './auth-selection.component';

describe('AuthSelectionComponent', () => {
  let component: AuthSelectionComponent;
  let fixture: ComponentFixture<AuthSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
