import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdepartmentReportComponent } from './subdepartment-report.component';

describe('SubdepartmentReportComponent', () => {
  let component: SubdepartmentReportComponent;
  let fixture: ComponentFixture<SubdepartmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubdepartmentReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubdepartmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
