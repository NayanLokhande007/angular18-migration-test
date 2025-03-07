import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalProcessComponent } from './approval-process.component';

describe('ApprovalProcessComponent', () => {
  let component: ApprovalProcessComponent;
  let fixture: ComponentFixture<ApprovalProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
