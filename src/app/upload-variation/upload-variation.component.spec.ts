import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVariationComponent } from './upload-variation.component';

describe('UploadVariationComponent', () => {
  let component: UploadVariationComponent;
  let fixture: ComponentFixture<UploadVariationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadVariationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
