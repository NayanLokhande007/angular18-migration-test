import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolComponentComponent } from './sol-component.component';

describe('SolComponentComponent', () => {
  let component: SolComponentComponent;
  let fixture: ComponentFixture<SolComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
