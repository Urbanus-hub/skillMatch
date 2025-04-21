import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillPathComponent } from './skill-path.component';

describe('SkillPathComponent', () => {
  let component: SkillPathComponent;
  let fixture: ComponentFixture<SkillPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillPathComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
