import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyQuestionsComponent } from './ready-questions.component';

describe('ReadyQuestionsComponent', () => {
  let component: ReadyQuestionsComponent;
  let fixture: ComponentFixture<ReadyQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadyQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
