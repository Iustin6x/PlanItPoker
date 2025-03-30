import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDetailsDialogComponent } from './story-details-dialog.component';

describe('StoryDetailsDialogComponent', () => {
  let component: StoryDetailsDialogComponent;
  let fixture: ComponentFixture<StoryDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
