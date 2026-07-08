import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-designation-for-edit',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './view-designation-for-edit.component.html',
  styleUrl: './view-designation-for-edit.component.css'
})
export class ViewDesignationForEditComponent implements OnInit {
  http = inject(HttpClient);
    router = inject(Router);
    constructor(private authService: AuthService) {}
  searchTerm: string = '';
  designations: any[] = [];
  filteredDesignations: any[] = [];
  ngOnInit(): void {
    this.loadDesignations();
  }

  // Load sample designations data
  private loadDesignations(): void {
    this.FetchDesignations();
  }
  FetchDesignations(): void {
    this.http.get("/api/User/GetAllDesignations").subscribe((data:any)=>{
      this.designations = data;
      this.filteredDesignations = [...this.designations];
    })
  }
onClickReports(): void {
   
  }
  // Search functionality
  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredDesignations = [...this.designations];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredDesignations = this.designations.filter(designation =>
      designation.name.toLowerCase().includes(searchTermLower) ||
      designation.code.toLowerCase().includes(searchTermLower)
    );
  }

  // Handle initialize button click
  onInitialize(designation: any): void {
    console.log('Initializing designation:', designation);
    alert(`Initializing ${designation.name} (${designation.code})`);
    
   
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
    return this.designations.find(designation => designation.code === code);
  }
  Edit(designation:string){
    this.router.navigate(['/designationedit'], {
  queryParams: { designation_Name: designation }
});
  console.log("Designatio gona be edited : ",designation);
  }
}
