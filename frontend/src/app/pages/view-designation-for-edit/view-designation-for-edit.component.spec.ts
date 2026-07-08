import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesignationForEditComponent } from './view-designation-for-edit.component';

describe('ViewDesignationForEditComponent', () => {
  let component: ViewDesignationForEditComponent;
  let fixture: ComponentFixture<ViewDesignationForEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDesignationForEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDesignationForEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
