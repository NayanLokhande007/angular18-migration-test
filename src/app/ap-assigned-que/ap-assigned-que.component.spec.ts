import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApAssignedQueComponent } from './ap-assigned-que.component';

describe('ApAssignedQueComponent', () => {
  let component: ApAssignedQueComponent;
  let fixture: ComponentFixture<ApAssignedQueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApAssignedQueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApAssignedQueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
