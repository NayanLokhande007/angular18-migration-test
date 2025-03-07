import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingQuestionsComponent } from './incoming-questions.component';

describe('IncomingQuestionsComponent', () => {
  let component: IncomingQuestionsComponent;
  let fixture: ComponentFixture<IncomingQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomingQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
