import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsFromSolComponent } from './as-from-sol.component';

describe('AsFromSolComponent', () => {
  let component: AsFromSolComponent;
  let fixture: ComponentFixture<AsFromSolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsFromSolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsFromSolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
