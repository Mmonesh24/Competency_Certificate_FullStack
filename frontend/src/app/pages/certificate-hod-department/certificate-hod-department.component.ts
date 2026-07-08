import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
 

@Component({
  selector: 'app-certificate-hod-department',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './certificate-hod-department.component.html',
  styleUrl: './certificate-hod-department.component.css'
})
export class CertificateHODDepartmentComponent {
onSubDepartmentClick(SubdeptName: any) {
  this.router.navigate(['/CertificateApprove'], { queryParams: { subDepartment:SubdeptName } });
  console.log("Clicked sub departmentName : ",SubdeptName);
}
onSearch() {
throw new Error('Method not implemented.');
}
  searchTerm: string = '';
  Subdepartment: any[] = []; // Changed from any[] to Designation[]
constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}


   logout(): void {
    this.authService.DeleteToken();
    this.router.navigateByUrl('/login');
  }
  isMenuOpen = false;

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
   isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  viewProfile() {
    this.isMenuOpen = false;
    console.log("View Profile clicked");
    // this.router.navigate(['/profile']); // Optional
  }

  ngOnInit(): void {
 var userData  = localStorage.getItem('userApp');
  if (userData) {
  // Parse the JSON string to an object
 var employee= JSON.parse(userData);
  if (employee) {
    this.fetchSubDepartment(employee.employeeDetails.departmentName);
  }
  }
}
  fetchSubDepartment(subDepartment: string): void {
    const encodedSubDepartment = encodeURIComponent(subDepartment);
   this.http.get(`https://localhost:7269/api/User/GetSbDepartmentsByDepartmentId/${encodedSubDepartment}`).subscribe(
      (data:any) => {
        this.Subdepartment =data;
        console.log('Fetched employees:', data);
        
    })};
}

  // Method to get designation by code


