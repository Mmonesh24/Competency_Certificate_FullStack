import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-designation-edit',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './designation-edit.component.html',
  styleUrl: './designation-edit.component.css'
})
export class DesignationEditComponent implements OnInit{
constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,private cdr: ChangeDetectorRef, private authService: AuthService) {}
 Data: any = {
    designation_Name: "",
    designation_type : 0,
    designationCode:"",
 }
 editedData:any={};
  ngOnInit(): void {
        var id = this.route.snapshot.queryParamMap.get('designation_Name');
        console.log("editing page : ",id);
        if(id){
        this.getdesignation(id);
        }
  }
  getdesignation(designation_Name: string){
    var encode = encodeURIComponent(designation_Name);
    this.http.get(`https://localhost:7269/api/User/GetDesignationByDesignationName/${encode}`)
      .subscribe({next :(data : any)=>{
          this.Data={...this.Data,...data};
          console.log("Fetched Data : ",this.Data)
          this.cdr.detectChanges();
      }})}
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
  this.editedData = {...this.Data};
  console.log("edited data:",this.editedData);
  this.http.put(`https://localhost:7269/api/User/UpdateDesignation/${encodeURIComponent(this.editedData.designation_Name)}`, this.editedData).subscribe({
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
