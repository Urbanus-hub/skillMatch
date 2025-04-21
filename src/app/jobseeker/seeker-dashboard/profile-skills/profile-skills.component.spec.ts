import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSKillsComponent } from './profile-skills.component';

describe('ProfileSKillsComponent', () => {
  let component: ProfileSKillsComponent;
  let fixture: ComponentFixture<ProfileSKillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSKillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSKillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
