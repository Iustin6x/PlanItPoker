import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickPlayComponent } from './quick-play.component';

describe('QuickPlayComponent', () => {
  let component: QuickPlayComponent;
  let fixture: ComponentFixture<QuickPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickPlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
