import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdContributorProfileComponent } from './ad-contributor-profile.component';

describe('AdContributorProfileComponent', () => {
  let component: AdContributorProfileComponent;
  let fixture: ComponentFixture<AdContributorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdContributorProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdContributorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
