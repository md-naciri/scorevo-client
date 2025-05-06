import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyModeScoreComponent } from './penalty-mode-score.component';

describe('PenaltyModeScoreComponent', () => {
  let component: PenaltyModeScoreComponent;
  let fixture: ComponentFixture<PenaltyModeScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyModeScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyModeScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
