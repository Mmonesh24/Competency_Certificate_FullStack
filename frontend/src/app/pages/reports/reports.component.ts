import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit{
    constructor( private authService: AuthService) {}
    http = inject(HttpClient);
router = inject(Router);
fetchlist:any={
  employeecount:0,
  certificatecount:0,
  Departmentcount:0,
  designationcount:0,
  subdepartmentcount:0,
  contractorcount:0
}
goToSection(arg0: string) {
  if(arg0 === 'employee') {
    this.router.navigate(['/employeereport']);
  }
  else if(arg0 === 'certificate') {
    this.router.navigate(['/reports-certificate']);
  }
  else if(arg0 === 'department') {
    this.router.navigate(['/departmentreport']);
  }
  else if(arg0 === 'designation') {
    this.router.navigate(['/designationreport']);
  }
  else if(arg0 === 'subdepartment') {
    this.router.navigate(['/subdepartmentreport']);
  }
  else if(arg0 === 'contractor'){
    this.router.navigate(['contractorview'])
  }
  else {
    console.error('Unknown section:', arg0);
  }
}

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

ngOnInit(): void {
  var loggedData = localStorage.getItem('userApp');
  if(loggedData){
    var userData = JSON.parse(loggedData);
    if(userData.employeeDetails.designation === "HR"){
      this.getAllEmployeeCount();
      this.getAllCertifficateCount();
  }
  else if(userData.employeeDetails.employee_type === 0){
    if(userData.employeeDetails.designation_Name === "HOD" || userData.employeeDetails.designation_Name?.toLowerCase() === "head of department" || userData.employeeDetails.designation_Name?.toLowerCase() === "head of the department"){
      this.getEmployeeCountByDepartment(userData.employeeDetails.departmentName);
      this.getAllCertificateCountByDepartment(userData.employeeDetails.departmentName);
    }
    else{
      this.getEmployeeCountBySubDepartment(userData.employeeDetails.subDepartmentName);
      this.getAllCertificateCountBySubDepartment(userData.employeeDetails.subDepartmentName);
    }
  }
        this.getAllDeptartmentCount();
      this.getAllDesignationCount();
      this.getAllSubDepartmentCount();
      this.getcontractorcount();
  
}
}
getcontractorcount(){
  this.http.get("https://localhost:7269/api/User/GetCountContractors").subscribe({
    next:(data:any)=>{
      this.fetchlist.contractorcount = data.count;
      console.log("Contractor count : ",this.fetchlist.contractorcount);
    }
  })
}
getAllCertificateCountBySubDepartment(SubDepartmentName: string): void {
  const encodedSubDept = encodeURIComponent(SubDepartmentName);
  const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get(`https://localhost:7269/api/User/GetCountGeneratedBySubDepartment/${encodedSubDept}`,{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Certificate Count by Sub Department API response:', res);
      if (res && res.count !== undefined) {
        this.fetchlist.certificatecount = res.count;
      } else {
        console.error('Unexpected response format:', res);
        alert("Unexpected response from server");
      }
    },
    error: (err: any) => {
      console.error('Error fetching certificate count by sub department:', err);
      alert("Error fetching certificate count by sub department");
    }
  });
}
getAllCertificateCountByDepartment(DepartmentName: string): void {
  const encodedDept = encodeURIComponent(DepartmentName);
    const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get(`https://localhost:7269/api/User/GetCountGeneratedByDepartment/${encodedDept}`,{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  })
    .subscribe({
      next: (res: any) => {
        console.log('Certificate Count by Department API response:', res);
        if (res && res.count !== undefined) {
          this.fetchlist.certificatecount = res.count;
        } else {
          console.error('Unexpected response format:', res);
          alert("Unexpected response from server");
        }
      },
      error: (err: any) => {
        console.error('Error fetching certificate count by department:', err);
        alert("Error fetching certificate count by department");
      }
    });
}

getAllCertifficateCount(): void {
    const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get("https://localhost:7269/api/User/GetCountGenerated",{ 
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Certificate Count API response:', res);
      if (res && res.count !== undefined) {
        this.fetchlist.certificatecount = res.count;
      } else {
        console.error('Unexpected response format:', res);
        alert("Unexpected response from server");
      }
    },
    error: (err: any) => {
      console.error('Error fetching certificate count:', err);
      alert("Error fetching certificate count");
    }
  });
}
getAllDeptartmentCount(): void {
    const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get("https://localhost:7269/api/User/GetCountDepartments",{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Department Count API response:', res);
      if (res && res.count !== undefined) {
        this.fetchlist.Departmentcount = res.count;
      } else {
        console.error('Unexpected response format:', res);
        alert("Unexpected response from server");
      }
    },
    error: (err: any) => {
      console.error('Error fetching department count:', err);
      alert("Error fetching department count");
    }
  });
}
getAllDesignationCount(): void {
    const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get("https://localhost:7269/api/User/GetCountDesignations",{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Designation Count API response:', res);
      if (res && res.count !== undefined) {
        this.fetchlist.designationcount = res.count;
      } else {
        console.error('Unexpected response format:', res);
        alert("Unexpected response from server");
      }
    },
    error: (err: any) => {
      console.error('Error fetching designation count:', err);
      alert("Error fetching designation count");
    }
  });
}
getAllSubDepartmentCount(): void {
    const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get("https://localhost:7269/api/User/GetCountSubDepartments",{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Sub Department Count API response:', res);
      if (res && res.count !== undefined) {
        this.fetchlist.subdepartmentcount = res.count;
      } else {
        console.error('Unexpected response format:', res);
        alert("Unexpected response from server");
      }
    },
    error: (err: any) => {
      console.error('Error fetching sub department count:', err);
      alert("Error fetching sub department count");
    }
  });
}
getAllEmployeeCount(): void {
  const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get("https://localhost:7269/api/User/GetCountEmployees",{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Employee Count API response:', res);
      if (res && res.count !== undefined) {
        this.fetchlist.employeecount = res.count;
      } else {
        console.error('Unexpected response format:', res);
        alert("Unexpected response from server");
      }
    },
    error: (err: any) => {
      console.error('Error fetching employee count:', err);
      alert("Error fetching employee count");
    }
  });
}

getEmployeeCountByDepartment(DepartmentName: string): void {
  const encodedDept = encodeURIComponent(DepartmentName);
    const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  // https://localhost:7269/api/User/GetCountEmployeesByDepartmentId/Information%20Technology
  // https://localhost:7269/api/User/GetCountEmployeesByDepartmentId/Information%20Technology
  console.log('calling api for department count');
  console.log(`API call: https://localhost:7269/api/User/GetCountEmployeesByDepartmentId/${encodedDept}`);
  console.log(`Logged data: ${loggedData}`);



  // reports.component.ts:303 Logged data: {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwMTAiLCJuYmYiOjE3NTE5MTEyMTUsImV4cCI6MTc1MTkxNDgxNSwiaWF0IjoxNzUxOTExMjE1fQ.8EYAif7pNukyTc7wL2GIHWwkGT86bnpBON_UQfBo8B8","message":"Executive Login successful","employeeDetails":
                                        // {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwMDUiLCJuYmYiOjE3NTE5MTEyODIsImV4cCI6MTc1MTkxNDg4MiwiaWF0IjoxNzUxOTExMjgyfQ.GdN7XYhk_4JqN-qs2ThJGY0WzKaQyVk1kMNOijLTduc","message":"Executive Login successful","employeeDetails":

  this.http.get(`https://localhost:7269/api/User/GetCountEmployeesByDepartmentId/${encodedDept}`,{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Employee Count by Department API response:', res);
        if (res && res.count !== undefined) {
          this.fetchlist.employeecount = res.count;
        } else {
          console.error('Unexpected response format:', res);
          alert("Unexpected response from server");
        }
      },
      error: (err: any) => {
        console.error('Error fetching employee count:', err);
        alert("Error fetching employee count");
      }
    });
}
getEmployeeCountBySubDepartment(SubDepartmentName:string): void {
  const encodedSubDept = encodeURIComponent(SubDepartmentName);
    const loggedData = localStorage.getItem('userApp');
  let token = '';
  if (loggedData) {
    const userData = JSON.parse(loggedData);
    token = userData.token;
  }
  this.http.get(`https://localhost:7269/api/User/GetCountEmployeesBySubDepartmentId/${encodedSubDept}`,{
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
  }).subscribe({
    next: (res: any) => {
      console.log('Employee Count by Sub Department API response:', res);
      if (res && res.count !== undefined) {
          this.fetchlist.employeecount = res.count;
        } else {
          console.error('Unexpected response format:', res);
          alert("Unexpected response from server");
        }
      },
      error: (err: any) => {
        console.error('Error fetching employee count:', err);
        alert("Error fetching employee count");
      }
    });



}
}