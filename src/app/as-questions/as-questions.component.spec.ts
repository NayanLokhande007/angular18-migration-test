import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsQuestionsComponent } from './as-questions.component';

describe('AsQuestionsComponent', () => {
  let component: AsQuestionsComponent;
  let fixture: ComponentFixture<AsQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
