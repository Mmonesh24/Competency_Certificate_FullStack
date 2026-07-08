import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css'
})
export class DepartmentFormComponent {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}
  Data:any={
    departmentName:"",
    departmentCode:""
  }
  logout(): void {
    this.authService.DeleteToken();
    this.router.navigateByUrl('/login');
  }
  onClickcard(): void {
    this.router.navigateByUrl('/certificate-initiate');
  }
   isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isMenuOpen = false;

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  viewProfile() {
    this.isMenuOpen = false;
    console.log("View Profile clicked");
    // this.router.navigate(['/profile']); // Optional
  }
 submitForm(){
   if (this.Data.departmentName && this.Data.departmentCode) {
    this.http.post("https://localhost:7269/api/User/AddDepartment", this.Data)
      .subscribe(response => {
        alert("Form submitted successfully");
        location.reload(); // Reload the page to reflect changes
      }, error => {
        alert("Error submitting form: " + error.message);
      });
   } else {
     alert("Form is invalid");
   }
 }
}
