import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateHODDepartmentComponent } from './certificate-hod-department.component';

describe('CertificateHODDepartmentComponent', () => {
  let component: CertificateHODDepartmentComponent;
  let fixture: ComponentFixture<CertificateHODDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateHODDepartmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificateHODDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
