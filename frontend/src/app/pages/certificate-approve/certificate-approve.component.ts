import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-certificate-approve',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './certificate-approve.component.html',
  styleUrl: './certificate-approve.component.css'
})
export class CertificateApproveComponent implements OnInit {
  
  showDepartmentIcon: boolean = false;
  filteredEmployees: any[] = [];
  isLoading: boolean = false;
  processingEmployeeId: string | null = null;
  searchTerm: string = '';
  
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService, 
    private route: ActivatedRoute
  ) {}

  InitializedId: any[] = [];
  EmployeeDetails: any[] = [];
  
  ngOnInit(): void {
    const subDepartmentName = this.route.snapshot.queryParamMap.get('subDepartment');
    if (!subDepartmentName) {
      console.error('Sub-department name is missing in the query parameters.');
      return;
    }

    console.log('Sub-department name:', subDepartmentName);
    this.fetchInitialized(subDepartmentName);
  }

  fetchInitialized(subDepartment: string): void {
    this.isLoading = true;
    const encodedSubDepartment = encodeURIComponent(subDepartment);

    this.http.get(`https://localhost:7269/api/User/GetAllInitiateBySubdepartment/${encodedSubDepartment}`)
      .subscribe((data: any) => {
        console.log('Fetched initialized IDs:', data);
        this.InitializedId = data.data;

        // Counter to track completed requests
        let completedRequests = 0;
        const totalRequests = this.InitializedId.length;

        if (totalRequests === 0) {
          this.isLoading = false;
          this.filteredEmployees = [];
          return;
        }

        // Clear previous employee details
        this.EmployeeDetails = [];

        // Fetch details for each employee
        for (let i = 0; i < this.InitializedId.length; i++) {
          const employeeId = this.InitializedId[i].employee_id;
          this.getEmployeeDetails(employeeId, () => {
            completedRequests++;
            if (completedRequests === totalRequests) {
              // All requests completed, now format the data for display
              this.formatEmployeeData();
              this.isLoading = false;
            }
          });
        }
      }, (error) => {
        console.error('Error fetching initialized data:', error);
        this.isLoading = false;
      });
  }

  getEmployeeDetails(employeeId: string, callback: () => void): void {
    const encode = encodeURIComponent(employeeId);
    this.http.get(`https://localhost:7269/api/User/GetEmployeeById/${encode}`)
      .subscribe((data: any) => {
        this.EmployeeDetails.push({ employeeId, data });
        console.log(`Employee details fetched for ID ${employeeId}:`, data);
        callback();
      }, (error) => {
        console.error(`Error fetching employee details for ID ${employeeId}:`, error);
        callback();
      });
  }

  formatEmployeeData(): void {
    // Transform the employee data to match the template expectations
    this.filteredEmployees = this.EmployeeDetails.map(emp => ({
      id: emp.data.employee_id || emp.employeeId,
      name: emp.data.employee_name || 'Unknown',
      department: emp.data.departmentName || 'Unknown Department',
      subDepartment: emp.data.subDepartmentName || 'Unknown Sub-Department',
      designation: emp.data.designation_Name || 'Unknown Designation',
      contact: emp.data.contactNo || '',
      // Add any other fields you need for display
      originalData: emp.data // Keep original data for reference
    }));
    
    console.log('Formatted employee data:', this.filteredEmployees);
  }

  /**
   * Handle search functionality
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.formatEmployeeData(); // Reset to all employees
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.EmployeeDetails
        .map(emp => ({
          id: emp.data.employee_id || emp.employeeId,
          name: emp.data.employee_name || 'Unknown',
          department: emp.data.departmentName || 'Unknown Department',
          subDepartment: emp.data.subDepartmentName || 'Unknown Sub-Department',
          designation: emp.data.designation_Name || 'Unknown Designation',
          contact: emp.data.contactNo || '',
          originalData: emp.data
        }))
        .filter(employee => 
          employee.name.toLowerCase().includes(searchLower) ||
          employee.id.toLowerCase().includes(searchLower) ||
          employee.department.toLowerCase().includes(searchLower) ||
          employee.subDepartment.toLowerCase().includes(searchLower) ||
          employee.designation.toLowerCase().includes(searchLower)
        );
    }
  }

  /**
   * Get employee initials for avatar
   */
  getEmployeeInitials(name: string): string {
    if (!name) return '??';
    
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  /**
   * Handle view and approve button click
   */
  viewAndApprove(employee: any): void {
    this.processingEmployeeId = employee.id;
    
   this.router.navigate(['/approve-page/cmrl-certificate'], { queryParams: { EmployeeId: employee.id } });
    
    // Simulate processing time - replace with actual approval logic
    setTimeout(() => {
      // Here you would typically:
      // 1. Navigate to detailed view
      // 2. Open a modal
      // 3. Call an API to approve the certificate
      
      alert(`Opening approval interface for ${employee.name} (${employee.id})`);
      
      // Remove from pending list (simulate approval)
      this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== employee.id);
      this.processingEmployeeId = null;
      
    }, 1000);
  }

  /**
   * Track by function for ngFor to improve performance
   */
  trackByEmployeeId(index: number, employee: any): string {
    return employee.id;
  }
}