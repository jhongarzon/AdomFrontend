import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { HttpModule, BaseRequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { Routing } from './app.routing';
import { DataListModule, DataTableModule, SharedModule, CheckboxModule, DropdownModule, FieldsetModule, DialogModule, CalendarModule, InputTextareaModule, InputTextModule, PanelModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts'
import { AlertMessageComponent } from './directives/alert.component';
import { ErrorComponent } from './components/error.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/security/users/user.component';
import { RoleComponent } from './components/security/roles/role.component';
import { RoleActionResourceComponent } from './components/security/roles/role.action.resource.component';
import { UserRoleComponent } from './components/security/users/user.role.component';
import { MenuComponent } from './components/security/menu/menu.component';
import { HomeComponent } from './components/home/home.component';
import { ChangePasswordComponent } from './components/security/users/changePassword.component';
import { RecoverPasswordComponent } from './components/login/recoverPassword.component';
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


import { AuthGuard } from './guards/index';
import { TodoService } from './services/todos.service';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { ProfessionalService } from './services/professional.service';
import { CoordinatorService } from './services/coordinator.service';
import { EntityService } from './services/entity.service';
import { SupplyService } from './services/supply.service';
import { ServiceService } from './services/service.service';
import { PatientService } from './services/patient.service';
import { PlanRateService } from './services/planRate.service';
import { PlanEntityService } from './services/planEntity.service';
import { CoPaymentFrecService } from './services/coPaymentFrec.service';
import { ServiceFrecuencyService } from './services/serviceFrecuency.service';
import { AssignServiceService } from './services/assignService.service';
import { NoticesService } from './services/notice.service';
import { AssignServiceDetailService } from './services/assignServiceDetail.service';
import { AssignServiceSupplyService } from './services/assignServiceSupply.service';
import { ProfessionalAssignedServicesService } from './services/professionalAssignedServices.service';
import { CopaymentService } from './services/copayment.service';
import { RipsService } from './services/rips.service';
import { CopaymentReportService } from './services/copaymentReport.service';
import { PaymentReportService } from './services/paymentReport.service';
import { SpecialReportService } from './services/specialReport.service';
import { ParameterService } from './services/parameter.service';
import { RoleActionResourceService } from './services/role.action.resource.service';
import { UserRoleService } from './services/user.role.service';
import { AlertService } from './services/alert.service';
import { AuthenticationService } from './services/authentication.service';
import { Config } from './config/config';
import { LockServicesService } from './services/lockServices.service';
import { HomeService } from './services/homeService.service';

import { Routes, RouterModule } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { registerLocaleData } from '@angular/common';
import lcoaleESCO from '@angular/common/locales/es-CO';

registerLocaleData(lcoaleESCO)


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    Routing,
    ChartsModule,
    DataTableModule,
    SharedModule,
    MaterializeModule,
    CheckboxModule,
    DropdownModule,
    FieldsetModule,
    DialogModule,
    CalendarModule,
    InputTextareaModule,
    InputTextModule,
    PanelModule,
    DataListModule,
    MyDatePickerModule,
    BrowserAnimationsModule

  ],
  declarations: [
    AppComponent,
    ErrorComponent,
    LoginComponent,
    UserComponent,
    RoleComponent,
    UserRoleComponent,
    RoleActionResourceComponent,
    AlertMessageComponent,
    MenuComponent,
    HomeComponent,
    ChangePasswordComponent,
    RecoverPasswordComponent,
    ProfessionalComponent,
    CoordinatorComponent,
    SupplyComponent,
    EntityComponent,
    ServiceComponent,
    PatientComponent,
    AssignServiceComponent,
    CoPaymentFrecuencyComponent,
    ServiceFrecuencyComponent,
    NoticesComponent,
    ProfessionalAssignedServicesComponent,
    CopaymentServicesComponent,
    RipsServiceComponent,
    CopaymentReportComponent,
    PaymentReportComponent,
    SpecialReportComponent,
    LockServicesComponent
  ],
  providers: [
    AuthGuard,
    TodoService,
    Config,
    AlertService,
    AuthenticationService,
    UserService,
    RoleService,
    UserRoleService,
    RoleActionResourceService,
    { provide: LOCALE_ID, useValue: "es-CO" },
    { provide: APP_INITIALIZER, useFactory: initFactory, deps: [Config], multi: true },
    
    ProfessionalService,
    CoordinatorService,
    EntityService,
    SupplyService,
    ServiceService,
    PatientService,
    ParameterService,
    PlanRateService,
    AssignServiceService,
    NoticesService,
    CoPaymentFrecService,
    ServiceFrecuencyService,
    AssignServiceDetailService,
    AssignServiceSupplyService,
    PlanEntityService,
    ProfessionalAssignedServicesService,
    CopaymentService,
    RipsService,
    CopaymentReportService,
    PaymentReportService,
    SpecialReportService,
    LockServicesService,
    HomeService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function initFactory(configirure: Config) {
  return () => configirure.load();
}
