import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsFromLatexComponent } from './as-from-latex.component';

describe('AsFromLatexComponent', () => {
  let component: AsFromLatexComponent;
  let fixture: ComponentFixture<AsFromLatexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsFromLatexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsFromLatexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
