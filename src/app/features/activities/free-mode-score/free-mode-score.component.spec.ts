import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeModeScoreComponent } from './free-mode-score.component';

describe('FreeModeScoreComponent', () => {
  let component: FreeModeScoreComponent;
  let fixture: ComponentFixture<FreeModeScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeModeScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeModeScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
