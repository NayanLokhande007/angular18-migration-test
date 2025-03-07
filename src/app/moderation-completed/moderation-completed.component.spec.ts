import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationCompletedComponent } from './moderation-completed.component';

describe('ModerationCompletedComponent', () => {
  let component: ModerationCompletedComponent;
  let fixture: ComponentFixture<ModerationCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationCompletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModerationCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
