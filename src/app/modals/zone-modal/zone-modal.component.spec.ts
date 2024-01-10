import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneModalComponent } from './zone-modal.component';

describe('ZoneModalComponent', () => {
  let component: ZoneModalComponent;
  let fixture: ComponentFixture<ZoneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
