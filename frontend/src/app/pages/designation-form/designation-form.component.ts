import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-designation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designation-form.component.html',
  styleUrl: './designation-form.component.css'
})
export class DesignationFormComponent {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}
  
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
 Data: any = {
    designation_Name: "",
    designation_type : 0,
    designationCode:""
 }
 submitForm(){
   if (this.Data.designation_Name && this.Data.designationCode) {
    this.http.post("https://localhost:7269/api/User/AddDesignation", this.Data)
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
