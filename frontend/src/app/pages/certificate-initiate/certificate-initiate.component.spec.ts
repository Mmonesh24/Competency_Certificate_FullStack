import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateInitiateComponent } from './certificate-initiate.component';

describe('CertificateInitiateComponent', () => {
  let component: CertificateInitiateComponent;
  let fixture: ComponentFixture<CertificateInitiateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateInitiateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificateInitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
