import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // 👈 Import this
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,CommonModule], // 👈 Add RouterModule here
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router,private authService: AuthService) {}

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
  menulist:any={
    HR:[
      {path:'/MasterDataManagement', name:'Master Data Management'},
      {path:'Reports', name:'Reports'},
    ],
    HOD:[
      {path:'/certificate-hod-department', name:'Certificate Approve'},
      {path:'Reports', name:'Reports'},
    ],
    Executive:[
      {path:'/certificate-initiate', name:'Certificate Initiation'},
      {path:'Reports', name:'Reports'},
    ]

  }
 
LoggedUserMenuList: any[] = [];

ngOnInit(): void {
  const loggedData = localStorage.getItem('userApp');
  if (loggedData) {
    const userData = JSON.parse(loggedData);

    // Ensure keys are correct and use === instead of .Equals()
    if ((userData.employeeDetails.designation?.toLowerCase() === "hr") || (userData.employeeDetails.departmentName?.toLowerCase()=== "hr") || (userData.employeeDetails.departmentName?.toLowerCase() ==="human resource")) {
      this.LoggedUserMenuList = this.menulist.HR;
    } else if (userData.employeeDetails.employee_type === 0) {
      if ((userData.employeeDetails.designation_Name?.toLowerCase() === "hod") || (userData.employeeDetails.designation_Name?.toLowerCase()==="head of department")) {
        this.LoggedUserMenuList = this.menulist.HOD;
      } else {
        this.LoggedUserMenuList = this.menulist.Executive;
      }
    } else {
      // Optional fallback
      this.LoggedUserMenuList = [];
    }

    console.log('Menu list for user:', this.LoggedUserMenuList);
  }
}
onMenuClick(menuItem: any): void {
  // Navigate to the selected menu item's path
  this.router.navigate([menuItem.path]);
  console.log('Navigating to:', menuItem.path);
}

}

