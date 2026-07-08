import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sub-department-edit',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './sub-department-edit.component.html',
  styleUrl: './sub-department-edit.component.css'
})
export class SubDepartmentEditComponent implements OnInit{
  constructor(private authService : AuthService,private http:HttpClient,private cdr : ChangeDetectorRef,private router : Router,private activateroute : ActivatedRoute){}
  subdept:string | null = "";
    Data:any={
    subDepartmentName:"",
    departmentName:""
  }
 editedData:any={};
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
  ngOnInit(): void {
    this.subdept = this.activateroute.snapshot.queryParamMap.get("SubDepartmentName");
    console.log("sub-department-edit : ",this.subdept)
    this.fetchdata(this.subdept);
  }
  fetchdata(subdept : string | null){
    if(subdept === null){
      alert("No Data")
      return
    }
    this.http.get(`/api/User/GetSubDepartmentByName/${encodeURIComponent(subdept)}`).subscribe({
      next:(data:any)=>{
          this.Data = {...this.Data,...data};
          console.log("Fetched Data : ",this.Data)
          this.cdr.detectChanges();
      }
    })

  }
 submitForm(){
  this.editedData = {...this.Data};
  console.log("edited data:",this.editedData);
  this.http.put(`/api/User/UpdateSubDepartment/${encodeURIComponent(this.editedData.subDepartmentName)}`, this.editedData).subscribe({
    next:(response)=>{
      console.log('designation edited succesfully',response)
      alert("edited successfully")
      location.reload();
    },
    error:(updateError)=>{
      this.showErrorMessages(updateError);
    }
  })
 }
  showErrorMessages(error: any): void {
  if (error?.error?.errors) {
    // Validation errors (from model validation attributes like [Required])
    const errorObj = error.error.errors;
    let messages: string[] = [];

    for (const key in errorObj) {
      if (errorObj.hasOwnProperty(key)) {
        messages.push(errorObj[key]);
      }
    }

    alert("❌ Please fix the following errors:\n\n" + messages.join('\n'));

  } else if (error?.error?.message) {
    // Custom error message from API (like "Photo is required.")
    alert("❌ " + error.error.message);

  } else {
    // Fallback for unknown error formats
    alert("❌ An unexpected error occurred:\n" + (error.message || 'Unknown error'));
  }
}
}
