import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateApproveComponent } from './certificate-approve.component';

describe('CertificateApproveComponent', () => {
  let component: CertificateApproveComponent;
  let fixture: ComponentFixture<CertificateApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificateApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
