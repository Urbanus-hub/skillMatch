import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiPoolComponent } from './ai-pool.component';

describe('AiPoolComponent', () => {
  let component: AiPoolComponent;
  let fixture: ComponentFixture<AiPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
