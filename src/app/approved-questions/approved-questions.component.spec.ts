import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedQuestionsComponent } from './approved-questions.component';

describe('ApprovedQuestionsComponent', () => {
  let component: ApprovedQuestionsComponent;
  let fixture: ComponentFixture<ApprovedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
