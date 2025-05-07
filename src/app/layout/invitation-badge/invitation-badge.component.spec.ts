import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationBadgeComponent } from './invitation-badge.component';

describe('InvitationBadgeComponent', () => {
  let component: InvitationBadgeComponent;
  let fixture: ComponentFixture<InvitationBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
