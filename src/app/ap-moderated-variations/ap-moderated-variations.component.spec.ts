import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApModeratedVariationsComponent } from './ap-moderated-variations.component';

describe('ApModeratedVariationsComponent', () => {
  let component: ApModeratedVariationsComponent;
  let fixture: ComponentFixture<ApModeratedVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApModeratedVariationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApModeratedVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
