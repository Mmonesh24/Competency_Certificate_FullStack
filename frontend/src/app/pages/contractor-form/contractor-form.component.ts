import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contractor-form',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './contractor-form.component.html',
  styleUrl: './contractor-form.component.css'
})
export class ContractorFormComponent{
  constructor(private authService :AuthService,private http :HttpClient , private router :Router){}
  data={
    contractorName:"",
    Logo:""
  }
 employeePhotoFileName: string = "";
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
imagePreview: string | null = null;

onPhotoUpload(event: any): void {
  const file: File = event.target.files[0];

  if (file) {
    this.employeePhotoFileName = file.name;

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;

      // Store the full base64 string in imagePreview for preview
      this.imagePreview = base64String;

      // Remove the base64 MIME header before storing in data.logo
      const base64Data = base64String.split(',')[1];
      this.data.Logo = base64Data;
    };

    reader.readAsDataURL(file);
  }
}

submitForm(){
  if(this.data.contractorName && this.data.Logo){
    this.http.post("https://localhost:7269/api/User/AddContractor",this.data).subscribe(response =>{
      alert("form submitted successfuly");
      location.reload();
    },error=>{
      alert("Error in submitted form:"+error.message);
    }
    );
  } else{
    alert("form is invalid");
  }
}
}
