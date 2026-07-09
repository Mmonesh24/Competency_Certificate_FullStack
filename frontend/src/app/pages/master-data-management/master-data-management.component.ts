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


  activeSectionName: string = 'Employees';
  
  // Section details mappings for descriptions and icons
  sectionMetadata: any = {
    'Employees': {
      icon: 'fa-users',
      desc: 'Access and maintain the primary personnel registry. Track names, unique identifiers, contact points, and active status.',
      metricLabel: 'Registered Personnel',
      countKey: 'employees',
      alert: 'Aadhaar (UIDAI) and Bank Details are transparently encrypted with AES-256 before disk storage.'
    },
    'Designation': {
      icon: 'fa-tags',
      desc: 'Define system designations, ranks, and roles. Map personnel to Executive or Non-Executive tiers for workflow processing.',
      metricLabel: 'Designation Formats',
      countKey: 'designations',
      alert: 'Designation mappings directly control signature authorities on generated competency certificates.'
    },
    'Departments': {
      icon: 'fa-building',
      desc: 'Configure core organizational divisions. Create parent departments that oversee sub-divisions and approval lines.',
      metricLabel: 'Active Departments',
      countKey: 'departments',
      alert: 'Departments must be registered prior to adding sub-departments or routing HOD approvals.'
    },
    'Sub Departments': {
      icon: 'fa-network-wired',
      desc: 'Define granular operational units (e.g., Signals, Depot, Traction) within primary parent departments.',
      metricLabel: 'Sub-Divisions',
      countKey: 'subdepartments',
      alert: 'Contractor employees are assigned to specific sub-departments to scope work clearance.'
    },
    'Contractor': {
      icon: 'fa-handshake',
      desc: 'Manage external vendor organizations and third-party contractors. Upload company logos and verify validation contracts.',
      metricLabel: 'Active Vendors',
      countKey: 'contractors',
      alert: 'Company logos are embedded directly into certificates for contractor/non-executive personnel.'
    }
  };

  // Live Counts
  counts: any = {
    employees: 0,
    designations: 0,
    departments: 0,
    subdepartments: 0,
    contractors: 0
  };

  sections = [
    { name: 'Employees', addpath: '/employeeadd', reportpath: '/employeereport', editpath: '/viewemployeeforedit' },
    { name: 'Designation', addpath: '/designationadd', reportpath: '/designationreport', editpath: '/viewdesignationforedit' }, 
    { name: 'Departments', addpath: '/departmentadd', reportpath: '/departmentreport', editpath: '/viewdepartmentforedit' },
    { name: 'Sub Departments', addpath: '/subdepartmentadd', reportpath: '/subdepartmentreport', editpath: '/viewdepartmentforsubedit' },
    { name: 'Contractor', addpath: '/contractoradd', reportpath: '/contractorview', editpath: '/contractorviewforedit' }
  ];

  isOpenMap: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.fetchCounts();
  }

  fetchCounts(): void {
    const loggedData = localStorage.getItem('userApp');
    if (loggedData) {
      const userData = JSON.parse(loggedData);
      const headers = { 'Authorization': 'Bearer ' + userData.token };

      this.http.get<any>('/api/User/GetCountEmployees', { headers }).subscribe(res => this.counts.employees = res.count || 0);
      this.http.get<any>('/api/User/GetCountDesignations', { headers }).subscribe(res => this.counts.designations = res.count || 0);
      this.http.get<any>('/api/User/GetCountDepartments', { headers }).subscribe(res => this.counts.departments = res.count || 0);
      this.http.get<any>('/api/User/GetCountSubDepartments', { headers }).subscribe(res => this.counts.subdepartments = res.count || 0);
      this.http.get<any>('/api/User/GetCountContractors', { headers }).subscribe(res => this.counts.contractors = res.count || 0);
    }
  }

  selectSection(name: string): void {
    this.activeSectionName = name;
  }

  getActiveSection(): any {
    return this.sections.find(s => s.name === this.activeSectionName) || this.sections[0];
  }

  getActiveMetadata(): any {
    return this.sectionMetadata[this.activeSectionName] || this.sectionMetadata['Employees'];
  }

  toggleDropdown(sectionName: string): void {
    this.isOpenMap[sectionName] = !this.isOpenMap[sectionName];
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

}
