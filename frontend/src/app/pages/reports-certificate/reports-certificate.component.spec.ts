import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsCertificateComponent } from './reports-certificate.component';

describe('ReportsCertificateComponent', () => {
  let component: ReportsCertificateComponent;
  let fixture: ComponentFixture<ReportsCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsCertificateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
