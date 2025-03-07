import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdProgrammerProfileComponent } from './ad-programmer-profile.component';

describe('AdProgrammerProfileComponent', () => {
  let component: AdProgrammerProfileComponent;
  let fixture: ComponentFixture<AdProgrammerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdProgrammerProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdProgrammerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
