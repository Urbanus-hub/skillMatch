import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiHunterComponent } from './ai-hunter.component';

describe('AiHunterComponent', () => {
  let component: AiHunterComponent;
  let fixture: ComponentFixture<AiHunterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiHunterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiHunterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
