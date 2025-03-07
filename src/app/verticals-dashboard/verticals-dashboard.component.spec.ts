import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalsDashboardComponent } from './verticals-dashboard.component';

describe('VerticalsDashboardComponent', () => {
  let component: VerticalsDashboardComponent;
  let fixture: ComponentFixture<VerticalsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerticalsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
