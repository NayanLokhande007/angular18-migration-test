import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadModerationComponent } from './upload-moderation.component';

describe('UploadModerationComponent', () => {
  let component: UploadModerationComponent;
  let fixture: ComponentFixture<UploadModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadModerationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
