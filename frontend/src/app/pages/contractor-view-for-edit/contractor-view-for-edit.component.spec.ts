import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorViewForEditComponent } from './contractor-view-for-edit.component';

describe('ContractorViewForEditComponent', () => {
  let component: ContractorViewForEditComponent;
  let fixture: ComponentFixture<ContractorViewForEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorViewForEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorViewForEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
