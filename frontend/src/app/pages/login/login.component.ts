import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {
  constructor(
    public service:AuthService
  ) { 

  }
  ngOnInit(): void {
  }
  
  selectedRole: string = 'admin'; // default

  
  LoginObj:any = {
  employeeId : "",
  password : "",
  }
 
  

  selectRole(role: string) {
    this.selectedRole = role;
    console.log('Selected role:', this.selectedRole);
  }

  http = inject(HttpClient);
  router = inject(Router);
onLogin() {
  this.http.post("/api/User/Login", this.LoginObj).subscribe({
  next: (res: any) => {
    console.log('Login API response:', res);
    if (res && res.token) {
      alert("User Login Successfully");
      //localStorage.setItem('userApp', JSON.stringify(res));
      this.service.saveToken(JSON.stringify(res));
      this.router.navigateByUrl('/HomeComponent');
    } else {
      console.error('Unexpected response format:', res);
      alert("Unexpected response from server");
    }
  },
  error: (error) => {
    if (error.status === 400) {
      alert("Invalid Body");
    } else {
      alert("Login failed: " + error.message);
    }
  }
});
}

}
