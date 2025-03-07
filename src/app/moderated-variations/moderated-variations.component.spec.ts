import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratedVariationsComponent } from './moderated-variations.component';

describe('ModeratedVariationsComponent', () => {
  let component: ModeratedVariationsComponent;
  let fixture: ComponentFixture<ModeratedVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratedVariationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratedVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
