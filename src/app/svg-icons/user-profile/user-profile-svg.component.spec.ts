import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSvgComponent } from './user-profile-svg.component';

describe('UserProfileComponent', () => {
  let component: UserProfileSvgComponent;
  let fixture: ComponentFixture<UserProfileSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
