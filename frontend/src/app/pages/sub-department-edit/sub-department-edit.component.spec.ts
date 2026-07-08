import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDepartmentEditComponent } from './sub-department-edit.component';

describe('SubDepartmentEditComponent', () => {
  let component: SubDepartmentEditComponent;
  let fixture: ComponentFixture<SubDepartmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubDepartmentEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubDepartmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
