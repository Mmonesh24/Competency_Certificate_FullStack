import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportsDesignationComponent } from './reports-designation.component';



describe('ReportsDesignationComponent', () => {
  let component: ReportsDesignationComponent;
  let fixture: ComponentFixture<ReportsDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsDesignationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportsDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
