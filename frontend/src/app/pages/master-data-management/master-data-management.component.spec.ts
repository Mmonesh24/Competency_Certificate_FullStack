import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataManagementComponent } from './master-data-management.component';

describe('MasterDataManagementComponent', () => {
  let component: MasterDataManagementComponent;
  let fixture: ComponentFixture<MasterDataManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDataManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
