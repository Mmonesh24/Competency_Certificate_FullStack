import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './shared/auth.guard';
import { MasterDataManagementComponent } from './pages/master-data-management/master-data-management.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { EmployeeReportComponent } from './pages/employee-report/employee-report.component';
import { DepartmentReportComponent } from './pages/department-report/department-report.component';
import { SubdepartmentReportComponent } from './pages/subdepartment-report/subdepartment-report.component';
import { CertificateInitiateComponent } from './pages/certificate-initiate/certificate-initiate.component';
import { ReportsDesignationComponent } from './pages/reports-designation/reports-designation.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { EmployeeEditComponent } from './pages/employee-edit/employee-edit.component';
import { DepartmentFormComponent } from './pages/department-form/department-form.component';
import { DesignationFormComponent } from './pages/designation-form/designation-form.component';
import { DepartmentEditComponent } from './pages/department-edit/department-edit.component';
import { DesignationEditComponent } from './pages/designation-edit/designation-edit.component';
import { ViewEmployeeForEditComponent } from './pages/view-employee-for-edit/view-employee-for-edit.component';
import { ViewDesignationForEditComponent } from './pages/view-designation-for-edit/view-designation-for-edit.component';
import { ViewDepartmentForEditComponent } from './pages/view-department-for-edit/view-department-for-edit.component';
import { SubDepartmentFormComponent } from './pages/sub-department-form/sub-department-form.component';
import { ViewDepartmentForSubEditComponent } from './pages/view-department-for-sub-edit/view-department-for-sub-edit.component';
import { ViewSubForEditComponent } from './pages/view-sub-for-edit/view-sub-for-edit.component';
import { CertificateHODDepartmentComponent } from './pages/certificate-hod-department/certificate-hod-department.component';
import { ReportsCertificateComponent } from './pages/reports-certificate/reports-certificate.component';
import { ApprovePageComponent } from './pages/approve-page/approve-page.component';
import { CmrlCertificateComponent } from './pages/cmrl-certificate/cmrl-certificate.component';
import { ContractorreportComponent } from './pages/contractorreport/contractorreport.component';
import { ContractorFormComponent } from './pages/contractor-form/contractor-form.component';
import { ContractorEditComponent } from './pages/contractor-edit/contractor-edit.component';
import { ContractorViewForEditComponent } from './pages/contractor-view-for-edit/contractor-view-for-edit.component';
import { SubDepartmentEditComponent } from './pages/sub-department-edit/sub-department-edit.component';
import { CertificateApproveComponent } from './pages/certificate-approve/certificate-approve.component';



export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path:'HomeComponent',
        component: HomeComponent,

        
    },
{
    path:'MasterDataManagement',
    component:MasterDataManagementComponent,
    canActivate: [authGuard]
},
  {
    path: 'certificate-initiate',
    component: CertificateInitiateComponent,
  },
    {
    path: 'certificate-hod-department',
    component: CertificateHODDepartmentComponent,
  },
{
    path:'CertificateApprove',
    component:CertificateApproveComponent,
    canActivate: [authGuard]
},
  {
    path: 'approve-page',
    component: ApprovePageComponent,
     children: [
    {
      path: 'cmrl-certificate',
      component: CmrlCertificateComponent
    },
     ]
  },
  {
    path:'reports-certificate',
    component:ReportsCertificateComponent
  },
{
    path:'Reports',
    component:ReportsComponent,
    canActivate: [authGuard]
},
{
    path:'employeereport',
    component:EmployeeReportComponent,
    canActivate: [authGuard]
},
{
    path:'departmentreport',
    component:DepartmentReportComponent,
    canActivate: [authGuard]
},
{
    path:'designationreport',
    component:ReportsDesignationComponent,
    canActivate: [authGuard]
},
{
    path: 'subdepartmentreport',
    component:SubdepartmentReportComponent,
    canActivate: [authGuard]
},
{
    path:'employeeadd',
    component:EmployeeFormComponent,
    canActivate: [authGuard]
},
{
    path: 'employeeedit',
    component:EmployeeEditComponent,
    canActivate: [authGuard]
},
{
    path:'departmentadd',
    component:DepartmentFormComponent,
    canActivate: [authGuard]
},
{
    path:'departmentedit',
    component:DepartmentEditComponent,
    canActivate: [authGuard]
},{
    path:'designationedit',
    component:DesignationEditComponent,
    canActivate: [authGuard]
},{
    path:'designationadd',
    component:DesignationFormComponent,
    canActivate: [authGuard]
},
{
    path:'subdepartmentadd',
    component:SubDepartmentFormComponent,
    canActivate: [authGuard]
},{
    path:'subdepartmentedit',
    component:SubDepartmentEditComponent,
    canActivate: [authGuard]
},
{
    path:'viewemployeeforedit',
    component:ViewEmployeeForEditComponent,
    canActivate: [authGuard]
},{
    path: 'viewdesignationforedit',
    component:ViewDesignationForEditComponent,
    canActivate: [authGuard]
},{
    path:'viewdepartmentforedit',
    component:ViewDepartmentForEditComponent,
    canActivate:[authGuard]
},{
    path:'viewdepartmentforsubedit',
    component:ViewDepartmentForSubEditComponent,
    canActivate:[authGuard]
},{
    path:'viewsubforedit',
    component:ViewSubForEditComponent,
    canActivate:[authGuard]
},{
    path:'contractorview',
    component:ContractorreportComponent,
    canActivate:[authGuard]
},{
    path:'contractoradd',
    component:ContractorFormComponent,
    canActivate:[authGuard]
},{
    path:'contractoredit',
    component:ContractorEditComponent,
    canActivate:[authGuard]
},{
    path:'contractorviewforedit',
    component:ContractorViewForEditComponent,
    canActivate:[authGuard]
}]

