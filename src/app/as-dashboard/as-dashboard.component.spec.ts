import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsDashboardComponent } from './as-dashboard.component';

describe('AsDashboardComponent', () => {
  let component: AsDashboardComponent;
  let fixture: ComponentFixture<AsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
