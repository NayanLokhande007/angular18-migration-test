import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSolutionproviderProfileComponent } from './ad-solutionprovider-profile.component';

describe('AdSolutionproviderProfileComponent', () => {
  let component: AdSolutionproviderProfileComponent;
  let fixture: ComponentFixture<AdSolutionproviderProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdSolutionproviderProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdSolutionproviderProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
