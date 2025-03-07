import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedVariationsComponent } from './assigned-variations.component';

describe('AssignedVariationsComponent', () => {
  let component: AssignedVariationsComponent;
  let fixture: ComponentFixture<AssignedVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedVariationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
