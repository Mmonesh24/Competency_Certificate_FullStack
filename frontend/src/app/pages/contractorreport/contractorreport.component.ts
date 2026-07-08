import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contractorreport',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './contractorreport.component.html',
  styleUrl: './contractorreport.component.css'
})
export class ContractorreportComponent implements OnInit {
  constructor(private authservice: AuthService, private http: HttpClient, private router: Router) {}
  
  data: any[] = []; // Changed from any={} to any[] since it's an array
  filteredContractors: any[] = []; // Renamed to be more descriptive
  searchTerm: string = '';
  isSideMenuOpen: boolean = false;

  toggleSideMenu(): void {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }

  closeSideMenu(): void {
    this.isSideMenuOpen = false;
  }

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
    this.authservice.DeleteToken();
    this.router.navigateByUrl('/login');
  }

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredContractors = [...this.data];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredContractors = this.data.filter((contractor: any) => {
      // Search by contractor name and any other relevant fields
      const contractorName = contractor.contractorName ? contractor.contractorName.toLowerCase() : '';
      const contractorCode = contractor.contractorCode ? contractor.contractorCode.toLowerCase() : '';
      const contractorId = contractor.contractorId ? contractor.contractorId.toString().toLowerCase() : '';
      
      return contractorName.includes(searchTermLower) ||
             contractorCode.includes(searchTermLower) ||
             contractorId.includes(searchTermLower);
    });
  }

  refreshContractors(): void {
    this.getdata();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredContractors = [...this.data];
  }

  ngOnInit(): void {
    this.getdata();
  }

  getdata() {
    this.http.get("https://localhost:7269/api/User/GetAllContractors").subscribe(
      (res: any) => {
        this.data = res.map((contractor: any) => {
          if (contractor.logo) {
            const mime = this.detectMimeType(contractor.logo);
            return {
              ...contractor,
              logoMimeType: mime
            };
          }
          return contractor;
        });

        // Initialize filtered contractors with all data
        this.filteredContractors = [...this.data];
        console.log("Processed contractor data:", this.data);
      },
      (err) => {
        console.error('Error fetching contractor data:', err);
      }
    );
  }

  detectMimeType(base64String: string): string {
    if (!base64String) return 'image/png'; // fallback

    const signatures: { [key: string]: string } = {
      '/9j/': 'image/jpeg',
      'iVBORw0KGgo': 'image/png',
      'R0lGODdh': 'image/gif',
      'UklGR': 'image/webp',
      'Qk': 'image/bmp'
    };

    const prefix = base64String.substring(0, 20);
    for (const sig in signatures) {
      if (prefix.startsWith(sig)) {
        return signatures[sig];
      }
    }

    return 'image/png'; // default fallback
  }
}