import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/login/recoverPassword.component';
import { UserComponent } from './components/security/users/user.component';
import { RoleComponent } from './components/security/roles/role.component';
import { MenuComponent } from './components/security/menu/menu.component';
import { ErrorComponent } from './components/error.component';
import { UserRoleComponent } from './components/security/users/user.role.component';
import { ChangePasswordComponent } from './components/security/users/changePassword.component';
import { RoleActionResourceComponent } from './components/security/roles/role.action.resource.component';
import { HomeComponent } from './components/home/home.component';
import { ProfessionalComponent } from './components/configuration/professional.component';
import { CoordinatorComponent } from './components/configuration/coordinator.component';
import { EntityComponent } from './components/configuration/entity.component';
import { SupplyComponent } from './components/configuration/supply.component';
import { ServiceComponent } from './components/configuration/service.component';
import { PatientComponent } from './components/configuration/patient.component';
import { ServiceFrecuencyComponent } from './components/configuration/serviceFrecuency.component';
import { CoPaymentFrecuencyComponent } from './components/configuration/coPaymentFrecuency.component';
import { AssignServiceComponent } from './components/serviceSupply/assignService.component';
import { NoticesComponent } from './components/notice/notices.component';
import { ProfessionalAssignedServicesComponent } from './components/serviceSupply/professionalAssignedServices.component';
import { CopaymentServicesComponent } from './components/copayment/copaymentService.component';
import { RipsServiceComponent } from './components/billing/ripsService.component';
import { CopaymentReportComponent } from './components/reports/copaymentReport.component';
import { PaymentReportComponent } from './components/reports/paymentReport.component';
import { SpecialReportComponent } from './components/reports/specialReport.component';
import { LockServicesComponent } from './components/configuration/lockServices.component';

const appRoutes: Routes = [ 
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent },
    { path: 'recoverpassword', component: RecoverPasswordComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'notices', component: NoticesComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'error', component: ErrorComponent, canActivate: [AuthGuard] },
    { path: 'role', component: RoleComponent, canActivate: [AuthGuard] },
    { path: 'professional', component: ProfessionalComponent, canActivate: [AuthGuard] },
    { path: 'coordinator', component: CoordinatorComponent, canActivate: [AuthGuard] },
    { path: 'patient', component: PatientComponent, canActivate: [AuthGuard] },
    { path: 'entity', component: EntityComponent, canActivate: [AuthGuard] },
    { path: 'supply', component: SupplyComponent, canActivate: [AuthGuard] },
    { path: 'service', component: ServiceComponent, canActivate: [AuthGuard] },
    { path: 'servicefrecuency', component: ServiceFrecuencyComponent, canActivate: [AuthGuard] },
    { path: 'copaymentfrecuency', component: CoPaymentFrecuencyComponent, canActivate: [AuthGuard] },
    { path: 'assignservice', component: AssignServiceComponent, canActivate: [AuthGuard] },
    { path: 'userrole', component: UserRoleComponent, canActivate: [AuthGuard] },
    { path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard] }, 
    { path: 'roleactionresource', component: RoleActionResourceComponent, canActivate: [AuthGuard] },
    { path: 'professionalassignedservices', component: ProfessionalAssignedServicesComponent, canActivate: [AuthGuard] },
    { path: 'copayment', component: CopaymentServicesComponent, canActivate: [AuthGuard] },    
    { path: 'ripsentity', component: RipsServiceComponent, canActivate: [AuthGuard] },    
    { path: 'copaymentreport', component: CopaymentReportComponent, canActivate: [AuthGuard] },    
    { path: 'reportpayments', component: PaymentReportComponent, canActivate: [AuthGuard] },
    { path: 'reportspecial', component: SpecialReportComponent, canActivate: [AuthGuard] },
    { path: 'lockservices', component: LockServicesComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

export const Routing = RouterModule.forRoot(appRoutes);