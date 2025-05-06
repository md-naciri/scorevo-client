import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityDialogComponent } from './create-activity-dialog.component';

describe('CreateActivityDialogComponent', () => {
  let component: CreateActivityDialogComponent;
  let fixture: ComponentFixture<CreateActivityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateActivityDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateActivityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
