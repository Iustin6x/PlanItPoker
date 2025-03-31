import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryComponentComponent } from './story-component.component';

describe('StoryComponentComponent', () => {
  let component: StoryComponentComponent;
  let fixture: ComponentFixture<StoryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
