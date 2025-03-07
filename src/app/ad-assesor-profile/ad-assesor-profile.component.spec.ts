import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdAssesorProfileComponent } from './ad-assesor-profile.component';

describe('AdAssesorProfileComponent', () => {
  let component: AdAssesorProfileComponent;
  let fixture: ComponentFixture<AdAssesorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdAssesorProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdAssesorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
