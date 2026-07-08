import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-department-for-sub-edit',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './view-department-for-sub-edit.component.html',
  styleUrl: './view-department-for-sub-edit.component.css'
})
export class ViewDepartmentForSubEditComponent implements OnInit {
  searchTerm: any;
  
  constructor(private authService: AuthService) { }
  
  DepartmentData: any[] = [];
  filteredDepartment: any[] = [];
  subDepartmentsMap: { [key: string]: any[] } = {};
  isSideMenuOpen: boolean = false;
  departmentToggleMap: { [key: string]: boolean } = {};

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredDepartment = [...this.DepartmentData];
      // Reset toggle states when clearing search
      this.departmentToggleMap = {};
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredDepartment = this.DepartmentData.filter(department => {
      // Check if department name matches
      const departmentMatches = department.departmentName.toLowerCase().includes(searchTermLower) ||
                               (department.departmentCode && department.departmentCode.toLowerCase().includes(searchTermLower));
      
      // Check if any subdepartment matches
      const subDepartments = this.subDepartmentsMap[department.departmentName] || [];
      const subDepartmentMatches = subDepartments.some(subDept => 
        subDept.subDepartmentName.toLowerCase().includes(searchTermLower) ||
        (subDept.subDepartmentCode && subDept.subDepartmentCode.toLowerCase().includes(searchTermLower))
      );
      
      // If a subdepartment matches, automatically expand the department
      if (subDepartmentMatches && !departmentMatches) {
        this.departmentToggleMap[department.departmentName] = true;
      }
      
      return departmentMatches || subDepartmentMatches;
    });
  }

  toggleSubDepartments(departmentName: string): void {
    this.departmentToggleMap[departmentName] = !this.departmentToggleMap[departmentName];
  }

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

  http = inject(HttpClient);
  router = inject(Router);

  ngOnInit(): void {
    this.fetchDepartmentData();
  }

  fetchDepartmentData(): void {
    this.http.get('https://localhost:7269/api/User/GetAllDepartments').subscribe((data: any) => {
      this.DepartmentData = data;
      this.filteredDepartment = [...this.DepartmentData];
      console.log('Department Data:', this.DepartmentData);

      // Fetch subdepartments for each department
      for (const dept of this.DepartmentData) {
        this.fetchSubDepartments(dept.departmentName);
      }
    });
  }

  fetchSubDepartments(departmentName: string): void {
    var encode = encodeURIComponent(departmentName);
    this.http.get(`https://localhost:7269/api/User/GetSbDepartmentsByDepartmentId/${encode}`)
      .subscribe((subDeps: any) => {
        this.subDepartmentsMap[departmentName] = subDeps;
        console.log(`Subdepartments for ${departmentName}:`, subDeps);
      });
  }

  // Helper method to highlight search terms in subdepartments
  getFilteredSubDepartments(departmentName: string): any[] {
    const subDepartments = this.subDepartmentsMap[departmentName] || [];
    
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return subDepartments;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    // If searching, only show matching subdepartments or all if department name matches
    const departmentMatches = departmentName.toLowerCase().includes(searchTermLower);
    
    if (departmentMatches) {
      return subDepartments; // Show all subdepartments if department matches
    }
    
    // Otherwise, filter subdepartments that match the search
    return subDepartments.filter(subDept => 
      subDept.subDepartmentName.toLowerCase().includes(searchTermLower) ||
      (subDept.subDepartmentCode && subDept.subDepartmentCode.toLowerCase().includes(searchTermLower))
    );
  }
  Edit(Department:string){
    this.router.navigate(['/viewsubforedit'], {
  queryParams: { department_name: Department }
});
  console.log("Designatio gona be edited : ",Department);
  }
}
