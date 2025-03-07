import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveLinkComponent } from './drive-link.component';

describe('DriveLinkComponent', () => {
  let component: DriveLinkComponent;
  let fixture: ComponentFixture<DriveLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriveLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriveLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
