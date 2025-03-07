import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsApprovedQuestionsComponent } from './as-approved-questions.component';

describe('AsApprovedQuestionsComponent', () => {
  let component: AsApprovedQuestionsComponent;
  let fixture: ComponentFixture<AsApprovedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsApprovedQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsApprovedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
