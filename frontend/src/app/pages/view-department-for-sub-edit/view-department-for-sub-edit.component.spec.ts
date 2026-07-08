import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDepartmentForSubEditComponent } from './view-department-for-sub-edit.component';

describe('ViewDepartmentForSubEditComponent', () => {
  let component: ViewDepartmentForSubEditComponent;
  let fixture: ComponentFixture<ViewDepartmentForSubEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDepartmentForSubEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDepartmentForSubEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
