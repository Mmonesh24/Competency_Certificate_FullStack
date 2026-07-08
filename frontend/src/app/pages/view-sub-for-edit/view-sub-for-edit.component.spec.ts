import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubForEditComponent } from './view-sub-for-edit.component';

describe('ViewSubForEditComponent', () => {
  let component: ViewSubForEditComponent;
  let fixture: ComponentFixture<ViewSubForEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSubForEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSubForEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
