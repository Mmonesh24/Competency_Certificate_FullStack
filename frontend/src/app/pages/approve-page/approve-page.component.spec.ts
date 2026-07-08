import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePageComponent } from './approve-page.component';

describe('ApprovePageComponent', () => {
  let component: ApprovePageComponent;
  let fixture: ComponentFixture<ApprovePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
