import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepasswordComponent } from './update-password.component';

describe('UpdatepasswordComponent', () => {
  let component: UpdatepasswordComponent;
  let fixture: ComponentFixture<UpdatepasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatepasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
