import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModerationComponent } from './new-moderation.component';

describe('NewModerationComponent', () => {
  let component: NewModerationComponent;
  let fixture: ComponentFixture<NewModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewModerationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
