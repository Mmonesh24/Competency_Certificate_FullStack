import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-report.component.html',
  styleUrl: './employee-report.component.css',
})
export class EmployeeReportComponent implements OnInit {
  searchTerm: any;
  trackByEmployeeId: TrackByFunction<any> = (index, item) => item.employee_id;
  filteredEmployee: any[] = [];
  getEmployeeInitials(arg0: any) {
    throw new Error('Method not implemented.');
  }
  http = inject(HttpClient);
  router = inject(Router);
  constructor(private authService: AuthService) {}
  isSideMenuOpen: boolean = false;
  toggleSideMenu(): void {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }

  // Close side menu
  closeSideMenu(): void {
    this.isSideMenuOpen = false;
  }

  // Navigation methods
  goHome(): void {
    console.log('Navigate to Home');
    this.router.navigateByUrl('/HomeComponent');
    this.closeSideMenu();
  }

  viewProfile(): void {
    console.log('Navigate to View Profile');
    this.closeSideMenu();
  }

  logout(): void {
    this.authService.DeleteToken();
    this.router.navigateByUrl('/login');
  }

  selectEmployee(arg0: any) {}
  employeelist: any[] = [];
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    var loggedData = localStorage.getItem('userApp');
    if (loggedData) {
      var userData = JSON.parse(loggedData);
      if (userData.employeeDetails.designation === 'HR') {
        this.listAllemployees();
      } else if (userData.employeeDetails.designation_Name === 'HOD'|| userData.employeeDetails.designation_Name?.toLowerCase() === "head of department") {
        this.listDeptEmployees(userData.employeeDetails.departmentName);
      } else {
        this.listSundeptEmployees(userData.employeeDetails.subDepartmentName);
      }
    }
  }
  
  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredEmployee = [...this.employeelist];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();

    this.filteredEmployee = this.employeelist.filter(
      (employee) =>
        employee.employee_name.toLowerCase().includes(searchTermLower) ||
        employee.employee_id.toLowerCase().includes(searchTermLower) ||
        employee.designation_Name.toLowerCase().includes(searchTermLower) ||
        (employee.departmentName && employee.departmentName.toLowerCase().includes(searchTermLower)) ||
        (employee.subDepartmentName && employee.subDepartmentName.toLowerCase().includes(searchTermLower))
    );
  }
  
  refreshDesignations(): void {
    this.ngOnInit();
    this.onSearch();
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEmployee = [...this.employeelist];
  }
  onInitialize(designation: any): void {
    console.log('Initializing designation:', designation);
    alert(
      `Initializing ${designation.departmentName} (${designation.departmentCode})`
    );
  }
  listAllemployees(): void {
    this.http
      .get('https://localhost:7269/api/User/GetAllEmployees')
      .subscribe((data: any) => {
        this.employeelist = data;
        this.filteredEmployee = [...this.employeelist];
      });
  }
  listDeptEmployees(department: string): void {
    const encodedDept = encodeURIComponent(department);
    this.http
      .get(
        `https://localhost:7269/api/User/GetEmployeesByDepartmentId/${encodedDept}`
      )
      .subscribe((data: any) => {
        this.employeelist = data;
        this.filteredEmployee = [...this.employeelist];
      });
  }

  listSundeptEmployees(subdepartment: string): void {
    const encodesubdept = encodeURIComponent(subdepartment);
    this.http
      .get(
        `https://localhost:7269/api/User/GetEmployeesBySubDepartmentId/${encodesubdept}`
      )
      .subscribe((data: any) => {
        this.employeelist = data;
        this.filteredEmployee = [...this.employeelist];
      });
  }
}