import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorreportComponent } from './contractorreport.component';

describe('ContractorreportComponent', () => {
  let component: ContractorreportComponent;
  let fixture: ComponentFixture<ContractorreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
