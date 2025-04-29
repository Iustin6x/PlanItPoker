import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSettingsDialogComponent } from './room-settings-dialog.component';

describe('RoomSettingsDialogComponent', () => {
  let component: RoomSettingsDialogComponent;
  let fixture: ComponentFixture<RoomSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSettingsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
