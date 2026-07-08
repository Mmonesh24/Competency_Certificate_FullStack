import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contractor-edit',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './contractor-edit.component.html',
  styleUrl: './contractor-edit.component.css'
})
export class ContractorEditComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  data={
    contractorName:"",
    logo:""
  }
  editedData:any={};
  ngOnInit(): void {
        var id = this.route.snapshot.queryParamMap.get('contractor');
        console.log("editing page : ",id);
        if(id){
        this.getcontractor(id);
        }
  }
getcontractor(contractorName: string) {
  var encode = encodeURIComponent(contractorName);
  this.http.get(`/api/User/GetContractorByName/${encode}`)
    .subscribe({
      next: (data: any) => {
        this.data = { ...this.data, ...data };

        // Set preview image from base64
        if (data.logo) {
          this.imagePreview = 'data:image/png;base64,' + data.logo;
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to fetch contractor data:", err);
      }
    });
}

 employeePhotoFileName: string = "";
    logout(): void {
    this.authService.DeleteToken();
    this.router.navigateByUrl('/login');
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
      const base64 = (reader.result as string).split(',')[1]; // Remove `data:image/...;base64,`
      this.imagePreview = reader.result as string;
      this.data.logo = base64; // Save base64 to submit to backend
    };

    reader.readAsDataURL(file);
  }
}

 submitForm(){
  this.editedData = {...this.data};
  console.log("edited data:",this.editedData);
  this.http.put(`/api/User/EditContractor${encodeURIComponent(this.editedData.contractorName)}`, this.editedData).subscribe({
    next:(response)=>{
      console.log('Contractor edited succesfully',response)
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
