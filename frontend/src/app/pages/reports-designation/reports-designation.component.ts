import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface Designation {
  id: number;
  designation_Name: string;
  designationCode: string;
} 

@Component({
  selector: 'app-reports-designation',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './reports-designation.component.html',
  styleUrl: './reports-designation.component.css'
})
export class ReportsDesignationComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  constructor(private authService: AuthService) {}
  
  searchTerm: string = '';
  designations: any[] = [];
  filteredDesignations: any[] = [];
  
  ngOnInit(): void {
    this.loadDesignations();
  }

  // Load designations data
  private loadDesignations(): void {
    this.FetchDesignations();
  }
  
  FetchDesignations(): void {
    this.http.get("/api/User/GetAllDesignations").subscribe((data: any) => {
      this.designations = data;
      this.filteredDesignations = [...this.designations];
    });
  }

  onClickReports(): void {
    // Implementation for reports functionality
  }

  // Search functionality - Fixed to use correct property names
  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredDesignations = [...this.designations];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredDesignations = this.designations.filter(designation =>
      designation.designation_Name.toLowerCase().includes(searchTermLower) ||
      designation.designationCode.toLowerCase().includes(searchTermLower)
    );
  }

  // Handle initialize button click
  onInitialize(designation: any): void {
    console.log('Initializing designation:', designation);
    alert(`Initializing ${designation.designation_Name} (${designation.designationCode})`);
  }

  refreshDesignations(): void {
    this.loadDesignations();
    this.onSearch(); 
  }

  // Method to clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDesignations = [...this.designations];
  }

  // Method to get designation by ID
  getDesignationById(id: number): any | undefined {
    return this.designations.find(designation => designation.id === id);
  }

  // Method to get designation by code
  getDesignationByCode(code: string): any | undefined {
    return this.designations.find(designation => designation.designationCode === code);
  }

  // TrackBy function for better performance
  trackByDesignationId(index: number, designation: any): any {
    return designation.id || index;
  }

  // Navigation methods
  goHome(): void {
    this.router.navigateByUrl('/home');
  }

  viewProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  logout(): void {
    this.authService.DeleteToken();
    this.router.navigateByUrl('/login');
  }
}
