import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDepartmentFormComponent } from './sub-department-form.component';

describe('SubDepartmentFormComponent', () => {
  let component: SubDepartmentFormComponent;
  let fixture: ComponentFixture<SubDepartmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubDepartmentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubDepartmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
