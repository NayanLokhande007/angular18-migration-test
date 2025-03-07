import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolApprovedComponent } from './sol-approved.component';

describe('SolApprovedComponent', () => {
  let component: SolApprovedComponent;
  let fixture: ComponentFixture<SolApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolApprovedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
