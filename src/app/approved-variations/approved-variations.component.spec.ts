import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedVariationsComponent } from './approved-variations.component';

describe('ApprovedVariationsComponent', () => {
  let component: ApprovedVariationsComponent;
  let fixture: ComponentFixture<ApprovedVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedVariationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovedVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
