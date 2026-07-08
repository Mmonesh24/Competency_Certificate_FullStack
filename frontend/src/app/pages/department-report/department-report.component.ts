import { CommonModule } from '@angular/common';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-department-report',
  standalone: true,
  imports: [FormsModule,CommonModule, RouterModule],
  templateUrl: './department-report.component.html',
  styleUrl: './department-report.component.css'
})
export class DepartmentReportComponent implements OnInit{
  constructor( private authService: AuthService) {}
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
       http = inject(HttpClient);
    router = inject(Router);
 DepartmentData:any[] = [];
filteredDepartment: any[]= [];
searchTerm: string = '';
ngOnInit(): void {
  this.fetchDepartmentData();
}
  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredDepartment = [...this.DepartmentData];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredDepartment = this.DepartmentData.filter(designation =>
      designation.departmentName.toLowerCase().includes(searchTermLower) ||
      designation.departmentCode.toLowerCase().includes(searchTermLower)
    );
  }
    refreshDesignations(): void {
    this.fetchDepartmentData();
    this.onSearch(); 
  }
    clearSearch(): void {
    this.searchTerm = '';
    this.filteredDepartment = [...this.DepartmentData];
  }
    onInitialize(designation: any): void {
    console.log('Initializing designation:', designation);
    alert(`Initializing ${designation.departmentName} (${designation.departmentCode})`);
  }
fetchDepartmentData(): void {
    this.http.get('https://localhost:7269/api/User/GetAllDepartments').subscribe((data:any)=>{
    debugger
    this.DepartmentData = data;
    this.filteredDepartment = [...this.DepartmentData];
    console.log('Department Data:', this.DepartmentData);
  })
}
}
