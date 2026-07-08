import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-sub-for-edit',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './view-sub-for-edit.component.html',
  styleUrl: './view-sub-for-edit.component.css'
})
export class ViewSubForEditComponent implements OnInit {
  http = inject(HttpClient);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    constructor(private authService: AuthService) {}
  searchTerm: string = '';
SubDepartment:any[]=[];
  filteredDesignations: any[] = [];
  id: string | null = null;

  ngOnInit(): void {
      this.id = this.activatedRoute.snapshot.queryParamMap.get('department_name');
      console.log("Came to edit page : ", this.id);
    this.loadSubdept(this.id);
  }

  // Load sample designations data
  private loadSubdept(id: string | null = null): void {
    if (id === null) {
      console.error('Department ID is null');
      return;
    }
    this.http.get(`/api/User/GetSbDepartmentsByDepartmentId/${encodeURIComponent(id)}`).subscribe({
      next:(data:any)=>{
          this.SubDepartment = data;
      }
    })
  }
onClickReports(): void {
   
  }
  // Search functionality
  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredDesignations = [...this.SubDepartment];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    this.filteredDesignations = this.SubDepartment.filter(designation =>
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
    this.loadSubdept();
    this.onSearch(); 
  }

  // Method to clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDesignations = [...this.SubDepartment];
  }

  // Method to get designation by ID
  getDesignationById(id: number): any | undefined {
    return this.SubDepartment.find(designation => designation.id === id);
  }

  // Method to get designation by code
  getDesignationByCode(code: string): any | undefined {
    return this.SubDepartment.find(designation => designation.code === code);
  }
  Edit(designation:string){
    this.router.navigate(['/subdepartmentedit'], {
  queryParams: {SubDepartmentName: designation }
});
  console.log("Designatio gona be edited : ",designation);
  }
}
