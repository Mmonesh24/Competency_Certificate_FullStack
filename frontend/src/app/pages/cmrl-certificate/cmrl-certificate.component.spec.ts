import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmrlCertificateComponent } from './cmrl-certificate.component';

describe('CmrlCertificateComponent', () => {
  let component: CmrlCertificateComponent;
  let fixture: ComponentFixture<CmrlCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmrlCertificateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CmrlCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
