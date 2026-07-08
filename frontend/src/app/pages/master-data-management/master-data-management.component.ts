import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master-data-management',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './master-data-management.component.html',
  styleUrl: './master-data-management.component.css'
})
export class MasterDataManagementComponent {
      constructor( private authService: AuthService) {}
      http = inject(HttpClient);
  router = inject(Router);
  isSidebarOpen = true;
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


  sections = [
    { name: 'Employees',addpath:'/employeeadd', reportpath:'/employeereport',editpath:'/viewemployeeforedit'},
    { name: 'Designation' ,addpath:'/designationadd', reportpath:'/designationreport',editpath:'/viewdesignationforedit' }, 
    { name: 'Departments' ,addpath:'/departmentadd', reportpath:'/departmentreport',editpath:'/viewdepartmentforedit' },
    {name:'Sub Departments' ,addpath:'/subdepartmentadd', reportpath:'/subdepartmentreport',editpath:'/viewdepartmentforsubedit'},
    {name:'Contractor' , addpath:'/contractoradd',reportpath:'/contractorview',editpath:'/contractorviewforedit'}
  ];
  isOpenMap: { [key: string]: boolean } = {};

toggleDropdown(sectionName: string): void {
  this.isOpenMap[sectionName] = !this.isOpenMap[sectionName];
}
navigateTo(path: string): void {
  this.router.navigateByUrl(path);
}

}
