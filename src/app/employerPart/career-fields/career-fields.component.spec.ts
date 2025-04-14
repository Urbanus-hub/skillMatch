import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerFieldsComponent } from './career-fields.component';

describe('CareerFieldsComponent', () => {
  let component: CareerFieldsComponent;
  let fixture: ComponentFixture<CareerFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerFieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
