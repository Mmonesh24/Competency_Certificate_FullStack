import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reports-certificate',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './reports-certificate.component.html',
  styleUrls: ['./reports-certificate.component.css']
})
export class ReportsCertificateComponent implements OnInit {
  searchTerm: string = '';
  generated: any[] = [];
  filteredEmployees: any[] = []; // This will hold the filtered results for display

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
  }

  ngOnInit(): void {
    const loggedData = localStorage.getItem('userApp');
    if (loggedData) {
      const userData = JSON.parse(loggedData);
     
      if (userData.employeeDetails.designation === "HR") {
        this.getallGeneratedCertificates();
      } else if (userData.employeeDetails.employee_type === 0) {
        if (userData.employeeDetails.designation_Name === "HOD") {
          this.getallgeneratedcertificateHod(userData.employeeDetails.departmentName);
        } else {
          this.getallgeneratedcertificateExecutive(userData.employeeDetails.subDepartmentName);
        }
      } else {
        console.log('No valid designation found, default action can be taken here.');
      }
    }
  }

  getallGeneratedCertificates(): void {
    this.http.get<any[]>("/api/User/GetAllGenerated").subscribe({
      next: (response) => {
        this.generated = response;
        console.log("Generated certificates:", this.generated);

        // Counter to track completed requests
        let completedRequests = 0;
        const totalRequests = this.generated.length;

        this.generated.forEach((generatedItem) => {
          const encodedEmpId = encodeURIComponent(generatedItem.employeeId);

          this.http.get<any>(`/api/User/GetEmployeeById/${encodedEmpId}`).subscribe({
            next: (employeeData) => {
              generatedItem.name = employeeData.employee_name;
              completedRequests++;
              
              // Update filtered list when all requests are complete
              if (completedRequests === totalRequests) {
                this.updateFilteredList();
              }
            },
            error: (error) => {
              console.error(`Error fetching employee with ID ${generatedItem.employeeId}:`, error);
              completedRequests++;
              
              // Update filtered list even if some requests fail
              if (completedRequests === totalRequests) {
                this.updateFilteredList();
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error fetching generated certificates:', error);
      }
    });
  }

  getallgeneratedcertificateHod(departmentName: string): void {
    const encodedDepartmentName = encodeURIComponent(departmentName);

    this.http.get<any[]>(`/api/User/GetAllGeneratedHod?departmentName=${encodedDepartmentName}`).subscribe({
      next: (response) => {
        this.generated = response;
        console.log("Generated certificates (HOD):", this.generated);

        let completedRequests = 0;
        const totalRequests = this.generated.length;

        this.generated.forEach((generatedItem) => {
          const encodedEmpId = encodeURIComponent(generatedItem.employeeId);

          this.http.get<any>(`/api/User/GetEmployeeById/${encodedEmpId}`).subscribe({
            next: (employeeData) => {
              generatedItem.name = employeeData.employee_name;
              completedRequests++;
              
              if (completedRequests === totalRequests) {
                this.updateFilteredList();
              }
            },
            error: (error) => {
              console.error(`Error fetching employee with ID ${generatedItem.employeeId}:`, error);
              completedRequests++;
              
              if (completedRequests === totalRequests) {
                this.updateFilteredList();
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error fetching generated certificates for HOD:', error);
      }
    });
  }

  getallgeneratedcertificateExecutive(subDepartmentName: string): void {
    const encodedSubDepartmentName = encodeURIComponent(subDepartmentName);

    this.http.get<any[]>(`/api/User/GetAllGeneratedExecutive?subDepartmentName=${encodedSubDepartmentName}`)
      .subscribe({
        next: (response) => {
          this.generated = response;
          console.log("Generated certificates:", this.generated);

          let completedRequests = 0;
          const totalRequests = this.generated.length;

          this.generated.forEach((generatedItem) => {
            const encodedEmpId = encodeURIComponent(generatedItem.employeeId);
            this.http.get<any>(`/api/User/GetEmployeeById/${encodedEmpId}`)
              .subscribe({
                next: (employeeData) => {
                  console.log("employeedata : ", employeeData);
                  generatedItem.name = employeeData.employee_name;
                  completedRequests++;
                  
                  if (completedRequests === totalRequests) {
                    this.updateFilteredList();
                  }
                },
                error: (error) => {
                  console.error(`Error fetching employee with ID ${generatedItem.employeeId}:`, error);
                  completedRequests++;
                  
                  if (completedRequests === totalRequests) {
                    this.updateFilteredList();
                  }
                }
              });
          });
        },
        error: (error) => {
          console.error('Error fetching generated certificates for Executive:', error);
        },
      });
  }

  // Update filtered list based on current search term
  updateFilteredList(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.generated];
    } else {
      this.onSearch();
    }
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.generated];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      
      this.filteredEmployees = this.generated.filter(employee => {
        const name = employee.name ? employee.name.toLowerCase() : '';
        const employeeId = employee.employeeId ? employee.employeeId.toLowerCase() : '';
        
        return name.includes(searchLower) || employeeId.includes(searchLower);
      });
    }
  }

  viewCertificate(employeeId: string): void {
    const employee = this.generated.find(emp => emp.employeeId === employeeId);

    if (employee && employee.competencyCertificate) {
      const byteCharacters = atob(employee.competencyCertificate);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
    } else {
      console.error('Certificate not found for employee:', employeeId);
    }
  }

  downloadCertificate(employeeId: string): void {
    const employee = this.generated.find(emp => emp.employeeId === employeeId);

    if (employee && employee.competencyCertificate) {
      const byteCharacters = atob(employee.competencyCertificate);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${employee.name || 'certificate'}.pdf`;
      a.click();
    } else {
      console.error('Certificate not found for employee:', employeeId);
    }
  }
}
