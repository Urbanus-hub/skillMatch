import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSkillMatchComponent } from './portfolio-skill-match.component';

describe('PortfolioSkillMatchComponent', () => {
  let component: PortfolioSkillMatchComponent;
  let fixture: ComponentFixture<PortfolioSkillMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioSkillMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioSkillMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
