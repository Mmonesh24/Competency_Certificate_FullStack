import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDepartmentForEditComponent } from './view-department-for-edit.component';

describe('ViewDepartmentForEditComponent', () => {
  let component: ViewDepartmentForEditComponent;
  let fixture: ComponentFixture<ViewDepartmentForEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDepartmentForEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDepartmentForEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
