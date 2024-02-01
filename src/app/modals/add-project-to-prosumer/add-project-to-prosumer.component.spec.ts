import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectToProsumerComponent } from './add-project-to-prosumer.component';

describe('AddProjectToProsumerComponent', () => {
  let component: AddProjectToProsumerComponent;
  let fixture: ComponentFixture<AddProjectToProsumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectToProsumerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectToProsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
