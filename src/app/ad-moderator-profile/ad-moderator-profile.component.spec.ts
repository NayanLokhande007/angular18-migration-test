import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdModeratorProfileComponent } from './ad-moderator-profile.component';

describe('AdModeratorProfileComponent', () => {
  let component: AdModeratorProfileComponent;
  let fixture: ComponentFixture<AdModeratorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdModeratorProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdModeratorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
