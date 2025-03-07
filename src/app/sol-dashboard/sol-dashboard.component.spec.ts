import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolDashboardComponent } from './sol-dashboard.component';

describe('SolDashboardComponent', () => {
  let component: SolDashboardComponent;
  let fixture: ComponentFixture<SolDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
