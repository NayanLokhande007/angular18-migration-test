import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsLatexCompletedComponent } from './as-latex-completed.component';

describe('AsLatexCompletedComponent', () => {
  let component: AsLatexCompletedComponent;
  let fixture: ComponentFixture<AsLatexCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsLatexCompletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsLatexCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
