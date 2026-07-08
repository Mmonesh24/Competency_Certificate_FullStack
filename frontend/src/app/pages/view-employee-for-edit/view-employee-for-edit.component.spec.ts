import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeForEditComponent } from './view-employee-for-edit.component';

describe('ViewEmployeeForEditComponent', () => {
  let component: ViewEmployeeForEditComponent;
  let fixture: ComponentFixture<ViewEmployeeForEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmployeeForEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewEmployeeForEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
