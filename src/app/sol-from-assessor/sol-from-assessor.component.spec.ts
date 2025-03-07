import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolFromAssessorComponent } from './sol-from-assessor.component';

describe('SolFromAssessorComponent', () => {
  let component: SolFromAssessorComponent;
  let fixture: ComponentFixture<SolFromAssessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolFromAssessorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolFromAssessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
