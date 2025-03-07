import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdApproverProfileComponent } from './ad-approver-profile.component';

describe('AdApproverProfileComponent', () => {
  let component: AdApproverProfileComponent;
  let fixture: ComponentFixture<AdApproverProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdApproverProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdApproverProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
