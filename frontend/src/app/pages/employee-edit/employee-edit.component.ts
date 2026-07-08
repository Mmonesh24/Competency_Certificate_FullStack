import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {


  constructor(private http: HttpClient,public sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, private authService: AuthService, private cdr: ChangeDetectorRef) {}
employeeData: any = {
  employee_id: "",
  employee_name: "",
  PhotoBase64: "",
  employee_type: 0,
  categoryName: 0,
  contractorName: null,
  dob: "2025-06-28",
  epF_UAN_NO: "",
  esA_NO: "",
  bankName: "",
  bankAccountNumber: "",
  passbookBase64: "",
  joiningDate: "2025-06-28",
  designation_Name: "",
  departmentName: "",
  subDepartmentName: null,
  aadharNo: 0,
  bloodGroup: "",
  contactNo: "",
  emerContactNo: "",
  status: 0
}
employeeedited:any = {};
public passbookPreviewUrl: SafeResourceUrl | null = null;
department:any[]=[];
designation:any[]=[];
subdepartment:any[]=[];
contractors:any[]=[];
emplogin: any = {};

ngOnInit(): void {
  var id = this.route.snapshot.queryParamMap.get('id');
  console.log('Employee ID from query params:', id);
  if (id) {
    this.getemployeeData(id);
  }
  this.fetchDepartment();
  this.fetchDesignation();
  this.fetchContractors();
}

getemployeeData(id: string | null): void {
  if (!id) {
    console.error('No employee ID provided');
    return;
  }

  this.http.get(`/api/User/GetEmployeeById/${encodeURIComponent(id)}`).subscribe({
    next: (data: any) => {
      this.employeeData = { ...this.employeeData, ...data };
      console.log('Employee data fetched:', this.employeeData);
      console.log('PhotoBase64 value:', this.employeeData.PhotoBase64);
      console.log(this.employeeData.passbookBase64?.slice(0, 30));
      
      if (this.employeeData.passbookBase64) {
        const fullDataUrl = 'data:application/pdf;base64,' + this.employeeData.passbookBase64;
        this.passbookPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullDataUrl);
      }
      
      // ✅ Fetch subdepartments after employee data is loaded
      if (this.employeeData.departmentName && this.employeeData.departmentName !== '' && this.employeeData.departmentName !== 'null') {
        console.log('Fetching subdepartments for existing department:', this.employeeData.departmentName);
        this.fetchSubDepartment(this.employeeData.departmentName);
      }
      
      this.cdr.detectChanges(); // Ensure view updates with new data
    },
    error: (error) => {
      console.error('Error fetching employee data:', error);
      alert("❌ Failed to fetch employee data. Please try again.");
    }
  });
}

fetchContractors(): void {
  this.http.get("/api/User/GetAllContractors").subscribe((data:any)=>{
    this.contractors = data;
    console.log('Contractors data fetched:', this.contractors);
  });
}

fetchDepartment():void{
  this.http.get("/api/User/GetAllDepartments").subscribe((data:any)=>{
    this.department = data;
  });
}

fetchDesignation():void{
  this.http.get("/api/User/GetAllDesignations").subscribe((data:any)=>{
    this.designation = data;
    console.log('Designation data fetched:', this.designation);
  });
}

fetchSubDepartment(departmentName: string): void {
  // Clear subdepartments first
  this.subdepartment = [];
  
  if (!departmentName || departmentName === '' || departmentName === 'null') {
    console.log('No valid department selected');
    return;
  }
  
  console.log('Fetching subdepartments for department:', departmentName);
  
  // Try the exact URL format that worked in your test
  const url = `/api/User/GetSbDepartmentsByDepartmentId/${encodeURIComponent(departmentName)}`;
  console.log('API URL:', url);
  
  this.http.get(url).subscribe({
    next: (data: any) => {
      console.log('Subdepartment API Response:', data);
      if (Array.isArray(data)) {
        this.subdepartment = data;
        console.log('Subdepartment array set:', this.subdepartment);
      } else {
        console.error('API did not return an array:', data);
        this.subdepartment = [];
      }
      this.cdr.detectChanges(); // ✅ Trigger change detection after subdepartments are loaded
    },
    error: (error) => {
      console.error('Error fetching subdepartments:', error);
      console.error('Status:', error.status);
      console.error('URL that failed:', url);
      this.subdepartment = [];
      this.cdr.detectChanges(); // ✅ Trigger change detection even on error
    }
  });
}

// Add this method to handle department selection changes
onDepartmentChange(): void {
  console.log('Department changed to:', this.employeeData.departmentName);
  console.log('Type of department value:', typeof this.employeeData.departmentName);
  
  // Reset subdepartment when department changes
  this.employeeData.subDepartmentName = null;

  // Add a small delay to ensure the value is properly set
  setTimeout(() => {
    this.fetchSubDepartment(this.employeeData.departmentName);
  }, 100);
}

onEmployeeTypeChange(): void {
  const empType = this.employeeData.employee_type;

  // If Executive is selected, force CMRL (0)
  if (empType === 0) {
    this.employeeData.categoryName = 0;
  }

  // If Non-Executive is selected and CMRL is selected, keep it or allow toggle
  if (empType === 1 && this.employeeData.categoryName === 0) {
    // Allow to stay as CMRL or switch manually
  }

  // If Executive and Non-CMRL is selected by manipulation, fix it
  if (empType === 0 && this.employeeData.categoryName === 1) {
    this.employeeData.categoryName = 0;
  }

  // If Non-Executive and both are disabled (rare), default to Non-CMRL
  if (empType === 1 && (this.employeeData.categoryName !== 0 && this.employeeData.categoryName !== 1)) {
    this.employeeData.categoryName = 1;
  }
}

passbookFileName: string = '';

onPassbookUpload(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  if (file.type !== 'application/pdf') {
    alert('Only PDF files are allowed.');
    input.value = '';
    return;
  }

  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`File size exceeds ${maxSizeMB} MB.`);
    input.value = '';
    return;
  }

  this.passbookFileName = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result as string;
    const base64 = result.split(',')[1];

    // ✅ For backend
    this.employeeData.passbookBase64 = base64;

    // ✅ For preview
    // ✅ Rebuild PDF preview if passbook exists
    if (this.employeeData.passbookBase64) {
      const fullDataUrl = 'data:application/pdf;base64,' + this.employeeData.passbookBase64;
      this.passbookPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullDataUrl);
    }

    this.cdr.detectChanges(); // Ensure view updates with new data
  };

  reader.readAsDataURL(file);
}

submitForm() {
  this.employeeedited = { ...this.employeeData }; // Create a copy of employeeData
  console.log('Edited Form', this.employeeedited);
  var encode = encodeURIComponent(this.employeeedited.employee_id);

  this.http.put(`/api/User/UpdateEmployee/${encode}`, this.employeeedited).subscribe({
    next: (response) => {
      console.log('Employee registered successfully:', response);

      this.emplogin = {
        employee_id: this.employeeedited.employee_id,
        Password: "CMRL" + this.getDesignationCode(this.employeeedited.designation_Name) + this.employeeedited.dob.replace(/-/g, '').slice(0, 6)
      };

      console.log('Employee login data:', this.emplogin);

      if (this.employeeedited.employee_type === 0) {
        // 🔁 Delete and THEN insert login
        this.http.delete(`/api/User/EmployeeLoginDelete/${encode}`).subscribe({
          next: (deleteResponse) => {
            console.log('Employee login deleted successfully:', deleteResponse);

            // ✅ Insert only after delete completes
            this.http.post("/api/User/AddEmployeeLogin", this.emplogin).subscribe({
              next: (loginResponse) => {
                alert("✅ Employee and login created successfully!");
                location.reload();
              },
              error: (loginError) => {
                this.showErrorMessages(loginError);
              }
            });
          },
          error: (deleteError) => {
            this.showErrorMessages(deleteError);
          }
        });
      } else {
        alert("✅ Employee created successfully!");
        location.reload();
      }
    },
    error: (error) => {
      this.showErrorMessages(error);
    }
  });
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

getDesignationCode(designation: string): string {
  const found = this.designation.find(item =>
    item.designation_Name?.trim().toLowerCase() === designation?.trim().toLowerCase()
  );
  if (found) {
    console.log('Designation code:', found.designationCode);
    return found.designationCode;
  }
  return '';
}

isHOD(): boolean {
  return this.employeeData.designation_Name === 'HOD';
}

employeePhotoFileName: string = '';

onPhotoUpload(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  // ✅ Validate image type
  if (!file.type.startsWith('image/')) {
    alert('Only image files (JPG, PNG, etc.) are allowed.');
    input.value = '';
    return;
  }

  // ✅ Validate size (2 MB max)
  const maxSizeMB = 2;
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`Image size exceeds ${maxSizeMB} MB.`);
    input.value = '';
    return;
  }

  this.employeePhotoFileName = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    const base64String = (reader.result as string).split(',')[1];
    
    // ⚠️ Still stored as base64 string (conversion happens in backend)
    this.employeeData.PhotoBase64 = base64String;

    console.log('✅ Photo selected:', this.employeePhotoFileName);
    console.log('📸 Base64 string stored in employeeData.PhotoBase64');
    console.log('📸 Base64 length:', base64String);
  };

  reader.readAsDataURL(file);
}

getSafePassbookUrl(): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(this.employeeData.passbookBase64);
}

downloadPhoto(photo: string): void {
  console.log("PhotoBase64 value:", photo);
  const base64Data = photo;

  if (!base64Data) {
    alert("No photo data available.");
    return;
  }

  // Determine MIME type (JPEG, PNG, etc.)
  let mimeType = 'image/jpeg'; // Default

  if (base64Data.startsWith('iVBORw0')) {
    mimeType = 'image/png';
  } else if (base64Data.startsWith('R0lGOD')) {
    mimeType = 'image/gif';
  }

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'employee_photo.jpg'; // You can change the filename if needed
  link.click();

  URL.revokeObjectURL(blobUrl); // Cleanup
}
}
