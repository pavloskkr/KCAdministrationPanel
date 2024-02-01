import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsumerToProjectComponent } from './prosumer-to-project.component';

describe('ProsumerToProjectComponent', () => {
  let component: ProsumerToProjectComponent;
  let fixture: ComponentFixture<ProsumerToProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProsumerToProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsumerToProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
