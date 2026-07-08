import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-cmrl-certificate',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './cmrl-certificate.component.html',
  styleUrl: './cmrl-certificate.component.css'
   
})
export class CmrlCertificateComponent implements OnInit  {
  constructor(
       private http: HttpClient, 
       private router: Router, 
       private authService: AuthService, 
       private route: ActivatedRoute
     ) {}

EmployeeDetails: any = null;
empimage : any=null;
contractor :any={};
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
  this.http.get(`/api/User/GetEmployeeById/${encode}`)
    .subscribe({
      next: (data: any) => {
        this.EmployeeDetails = data;  // Wrap in arra     // Make sure to call this!
        const today = new Date();
        this.EmployeeDetails.dateOfIssue = this.formatDate(today); // DD/MM/YYYY form
        const twoYearsLater = new Date(today);
        twoYearsLater.setFullYear(today.getFullYear() + 2);
        this.EmployeeDetails.validTo = this.formatDate(twoYearsLater);
        this.EmployeeDetails.certificateNumber = `CMRL${data.employee_type}${data.employee_id}`;
        this.contractor.name = data.contractorName;
        this.contractor.logo = this.getlogo(this.contractor.name);
        
        console.log("contractorName : ",this.contractor.name)
        console.log(`Employee details fetched for ID ${employeeId}:`, data);
        console.log('Employee ID:', this.EmployeeDetails);
        console.log('Employee Type:', this.EmployeeDetails.employee_type);
        console.log('Date of Issue:', this.EmployeeDetails.dateOfIssue);
        const imgtype = this.detectImageMimeType(data.photoBase64);
        this.empimage = `data:${imgtype};base64,${data.photoBase64}`;
        console.log("image : ",this.empimage);
      },
      error: (error) => {
        console.error(`Error fetching employee details for ID ${employeeId}:`, error);
      }
    });
}
getlogo(name: string): void {
  this.http.get<any>(`/api/User/GetContractorByName/${encodeURIComponent(name)}`).subscribe({
    next: (data) => {
      if (!data.logo) {
        console.warn('No logo found for contractor');
        this.contractor.logo = null;
        return;
      }

      const mimeType = this.detectImageMimeType(data.logo);
      this.contractor.logo = `data:${mimeType};base64,${data.logo}`;
      console.log("logo:",this.contractor.logo);
    },
    error: (err) => {
      console.error('Error fetching contractor logo:', err);
      this.contractor.logo = null;
    }
  });
}

/**
 * Detect MIME type from the beginning of a base64 string.
 */
private detectImageMimeType(base64: string): string {
  if (!base64) return 'image/png'; // default fallback

  const signature = base64.substring(0, 10);

  if (signature.startsWith('/9j/')) return 'image/jpeg';
  if (signature.startsWith('iVBOR')) return 'image/png';
  if (signature.startsWith('R0lGOD')) return 'image/gif';
  if (signature.startsWith('Qk')) return 'image/bmp';
  if (signature.startsWith('UklGR')) return 'image/webp';
  if (signature.startsWith('AAABAA')) return 'image/x-icon'; // ICO
  // You can extend this list as needed

  return 'image/png'; // default fallback if unknown
}

formatDate(date: Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

//   downloadPDF(): void {
//   const element = document.getElementById('certificate-to-download');
//   const options = {
//     margin:       0,
//     filename:     `${this.EmployeeDetails.employee_name}_CMRL_Certificate.pdf`,
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
//   };

//   if (element) {
//     html2pdf().from(element).set(options).save();
//   } else {
//     console.error("Certificate element not found.");
//   }
// }
//   // Method to print certificates
//   printCertificates(): void {
//     window.print();
//   }
}
