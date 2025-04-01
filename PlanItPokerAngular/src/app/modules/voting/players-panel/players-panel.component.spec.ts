import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersPanelComponent } from './players-panel.component';

describe('PlayersPanelComponent', () => {
  let component: PlayersPanelComponent;
  let fixture: ComponentFixture<PlayersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
