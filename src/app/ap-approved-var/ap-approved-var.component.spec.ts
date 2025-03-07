import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApApprovedVarComponent } from './ap-approved-var.component';

describe('ApApprovedVarComponent', () => {
  let component: ApApprovedVarComponent;
  let fixture: ComponentFixture<ApApprovedVarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApApprovedVarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApApprovedVarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
