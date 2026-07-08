import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-approve-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './approve-page.component.html',
  styleUrl: './approve-page.component.css'
})


export class ApprovePageComponent implements OnInit {
  constructor(
     private http: HttpClient, 
     private router: Router, 
     private authService: AuthService, 
     private route: ActivatedRoute
   ) {}

EmployeeDetails: any = null;

  isApproved: boolean = false;
  showConfirmationPopup: boolean = false;
  showDownloadMessage: boolean = false;
  showCertificateGenerated = false;
  approvalMessage: string = '';

   isLoading: boolean = false;
 logout(): void {
    this.authService.DeleteToken();
    this.router.navigateByUrl('/login');
  }
  isMenuOpen = false;

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
   isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  viewProfile() {
    this.isMenuOpen = false;
    console.log("View Profile clicked");
    // this.router.navigate(['/profile']); // Optional
  }




   
   ngOnInit(): void {
     const emp = this.route.snapshot.queryParamMap.get('EmployeeId');
      if (!emp) {
        console.error('Employee ID is missing in the query parameters.');
        return;
      }
      this.getEmployeeDetails(emp);

   }

  

getEmployeeDetails(employeeId: string): void {
  const encode = encodeURIComponent(employeeId);
  this.http.get(`https://localhost:7269/api/User/GetEmployeeById/${encode}`)
    .subscribe({
      next: (data: any) => {
        this.EmployeeDetails = data;  // Wrap in arra     // Make sure to call this!
        const today = new Date();
        this.EmployeeDetails.dateOfIssue = this.formatDate(today); // DD/MM/YYYY form
        const twoYearsLater = new Date(today);
        twoYearsLater.setFullYear(today.getFullYear() + 2);
        this.EmployeeDetails.validTo = this.formatDate(twoYearsLater);
        this.EmployeeDetails.certificateNumber = `CMRL${data.employee_type}${data.employee_id}`;
        console.log(`Employee details fetched for ID ${employeeId}:`, data);
        console.log('Employee ID:', this.EmployeeDetails);
              console.log('Employee Type:', this.EmployeeDetails.employee_type);
              console.log('Date of Issue:', this.EmployeeDetails.dateOfIssue);
      },
      error: (error) => {
        console.error(`Error fetching employee details for ID ${employeeId}:`, error);
      }
    });
}


determineCertificateType(employeeData: any): string {
  // Logic to determine if employee is contractor or regular employee
  // Updated to use correct property names from API response
  if (employeeData?.employee_type === 'contractor' || 
      employeeData?.departmentName?.toLowerCase().includes('contractor') ||
      employeeData?.subDepartmentname?.toLowerCase().includes('contractor') ||
      employeeData?.contractorName) { // Also check if contractorName exists
    return 'contractor';
  }
  return 'employee';
}

   approveCertificate(): void {
    
    this.showConfirmationPopup = true;
  }
closePopup() {
  this.showConfirmationPopup = false;
}
// Updated confirmAction method
confirmAction() {
  this.showConfirmationPopup = false;
  this.showCertificateGenerated = true;
  
  // Generate and store certificate
  this.generateAndStoreCertificate();
  
  console.log("Approved:", this.EmployeeDetails.employee_name);
}

// New method to generate PDF and store in database
generateAndStoreCertificate() {
  const certificateElement = document.getElementById('certificate-to-download');
  if (certificateElement) {
    certificateElement.classList.add('export-mode');
    
    import('html2pdf.js').then((module) => {
      const html2pdf = module.default;
      const opt = {
        margin: 0,
        filename: 'cmrl_certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Wait briefly to ensure any style/layout rendering is complete
      setTimeout(() => {
        html2pdf().from(certificateElement).set(opt).outputPdf('datauristring').then((pdfDataUri: string) => {
          // Extract base64 from data URI (remove "data:application/pdf;base64," prefix)
          const base64String = pdfDataUri.split(',')[1];
          
          // Store in database
          this.storeCertificateInDatabase(base64String);
          
          // Optional cleanup
          certificateElement.classList.remove('export-mode');
        }).catch((err: any) => {
          console.error('Error generating PDF:', err);
          certificateElement.classList.remove('export-mode');
        });
      }, 300);
      
    }).catch(err => {
      console.error('Error loading html2pdf:', err);
    });
  } else {
    console.error('Certificate element not found.');
  }
}

// Method to store certificate in database and delete from initiate table
// Method to store certificate in database and delete from initiate table
storeCertificateInDatabase(base64String: string) {
  const generatedData = {
    employeeId: this.EmployeeDetails.employee_id,        // Use lowercase from your data
    employeeName: this.EmployeeDetails.employee_name,    // Use lowercase from your data
    competencyCertificate: base64String,
    validity: null // Set validity as needed
  };
  
  // Call API to store in Generated table
  this.http.post('https://localhost:7269/api/User/AddGenerated', generatedData).subscribe({
    next: (response) => {
      console.log('Certificate stored successfully:', response);
      
      // Delete from initiate table after successful storage
      this.deleteFromInitiateTable();
    },
    error: (error) => {
      console.error('Error storing certificate:', error);
    }
  });
}

// Method to delete from initiate table
deleteFromInitiateTable() {
  
  const deleteUrl = `https://localhost:7269/api/User/DeleteFromInitiate/${this.EmployeeDetails.employee_id}`;
  
  this.http.delete(deleteUrl).subscribe({
    next: (response) => {
      console.log('Employee deleted from initiate table:', response);
    },
    error: (error) => {
      console.error('Error deleting from initiate table:', error);
    }
  });
}

// Updated download method (unchanged)
downloadCertificate() {
  const certificateElement = document.getElementById('certificate-to-download');
  if (certificateElement) {
    certificateElement.classList.add('export-mode');
    
    import('html2pdf.js').then((module) => {
      const html2pdf = module.default;
      const opt = {
        margin: 0,
        filename: 'cmrl_certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      setTimeout(() => {
        html2pdf().from(certificateElement).set(opt).save().then(() => {
          certificateElement.classList.remove('export-mode');
        });
      }, 300);
      
    }).catch(err => {
      console.error('Error loading html2pdf:', err);
    });
  } else {
    console.error('Certificate element not found.');
  }
}
  // Method to handle confirmation Yes button
  confirmApproval(): void {
    this.showConfirmationPopup = false;
    this.isApproved = true;
    this.approvalMessage = 'The certificate is generated';
    console.log('Certificate approved for employee:', this.EmployeeDetails);
    // Add your API call for approval here if needed
  }

  // Method to handle confirmation No button
  cancelApproval(): void {
    this.showConfirmationPopup = false;
  }

  // Method to reject a certificate
  rejectCertificate(): void {
    // Add your rejection logic here
    this.router.navigate(['/CertificateApprove']);
    console.log('Rejecting certificate for employee:');
    // You can make an API call to reject the certificate
  }


    
    // Method to generate certificate number
    generateCertificateNumber(employeeId: string): string {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `OPSC${year}${month}${employeeId.slice(-3)}`;
    }

    // Method to format date
    formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Helper method to check if employees are available
    hasEmployees(): boolean {
      return this.EmployeeDetails && this.EmployeeDetails.length > 0;
    }
}