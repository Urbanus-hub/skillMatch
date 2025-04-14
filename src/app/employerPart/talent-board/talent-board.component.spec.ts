import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentBoardComponent } from './talent-board.component';

describe('TalentBoardComponent', () => {
  let component: TalentBoardComponent;
  let fixture: ComponentFixture<TalentBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalentBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
