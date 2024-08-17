import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewcompComponent } from './addnewcomp.component';

describe('AddorgComponent', () => {
  let component: AddnewcompComponent;
  let fixture: ComponentFixture<AddnewcompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewcompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
