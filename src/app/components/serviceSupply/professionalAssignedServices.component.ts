import { Component, OnInit } from '@angular/core';
import { ProfessionalAssignedServicesService } from '../../services/professionalAssignedServices.service';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { ProfessionalService } from '../../models/professionalService';
import { AssignServiceDetailService } from '../../services/assignServiceDetail.service';
import { AssignServiceDetail } from '../../models/assignServiceDetail';
import { FieldsetModule } from 'primeng/primeng';
import { SelectItem } from '../../models/selectItem';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';


declare var $: any
declare var jQuery: any


@Component({
    selector: 'professionalAssignedServices',
    templateUrl: 'professionalAssignedServices.component.html'
})

export class ProfessionalAssignedServicesComponent implements OnInit {
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onProfessionalServicesDetail: boolean = false;
    public scheduledServices: ProfessionalService[] = [];
    public completedServices: ProfessionalService[] = [];
    public assignServicesDetail: AssignServiceDetail[] = [];
    public userId: number;
    public currentAssignService: ProfessionalService;
    public paymentTypes: SelectItem[] = [];
    public currentPatient: Patient;

    constructor(private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private configuration: Config,
        private professionalAssinedServicesService: ProfessionalAssignedServicesService,
        private assignServiceDetailService: AssignServiceDetailService,
        private patientService: PatientService) {

    }
    ngOnInit(): void {
        this.authenticationService.isAuthorize("/ProfessionalAssignedServices/Get");
        this.onProfessionalServicesDetail = this.authenticationService.hasPermissionResourceAction("/AssignServiceDetail/Get");
        this.userId = this.authenticationService.getUserId();
        this.currentAssignService = new ProfessionalService();
        this.currentPatient = new Patient();
        this.loadAssignedServices();
        this.loadCompletedServices();
    }
    private loadAssignedServices(): void {
        this.scheduledServices = [];

        this.professionalAssinedServicesService.getScheduledServices(this.userId)
            .subscribe((res) => {
                if (res.success) {

                    this.scheduledServices = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }
    private loadCompletedServices(): void {
        this.scheduledServices = [];

        this.professionalAssinedServicesService.getCompletedServices(this.userId)
            .subscribe((res) => {
                if (res.success) {
                    this.completedServices = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }
    public viewProfessionalServiceDetail(professionalService: ProfessionalService): void {

        this.inReadMode = false;
        this.inEditMode = true;
        this.assignServicesDetail = [];

        this.currentAssignService = this.scheduledServices.find(item => item.serviceId == professionalService.serviceId);
        if (this.currentAssignService == null) {
            this.currentAssignService = this.completedServices.find(item => item.serviceId == professionalService.serviceId);
        }
        this.patientService.getById(professionalService.patientId)
            .subscribe((res) => {

                if (res.success) {
                    this.currentPatient = res.result;


                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });

        this.paymentTypes = this.loadPaymentTypes();
        this.assignServiceDetailService.getByAssignServiceId(professionalService.assignServiceId)
            .subscribe((res) => {
                if (res.success) {
                    this.assignServicesDetail = res.result;


                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }
    public loadPaymentTypes(): any {
        let items: SelectItem[] = [];

        let cash = new SelectItem();
        cash.value = "1";
        cash.label = "Efectivo";

        let pin = new SelectItem();
        pin.value = "2";
        pin.label = "PIN";

        let other = new SelectItem();
        other.value = "3";
        other.label = "OTRO";

        items[0] = cash;
        items[1] = pin;
        items[2] = other;
        return items;
    }
    public markDetailAsCompleted(assignServiceDetail: AssignServiceDetail): void {
        if (assignServiceDetail.paymentType == 0) {
            this.configuration.ShowAlertMessage("Ingrese un medio de pago");
            return;
        }
        if (assignServiceDetail.paymentType != 2) {
            assignServiceDetail.pin = 0;
            if ((assignServiceDetail.receivedAmount == null || assignServiceDetail.receivedAmount == 0)) {
                this.configuration.ShowAlertMessage("Ingrese un valor para el valor recibido");
                return;
            }
        }

        if (assignServiceDetail.paymentType == 2) {
            assignServiceDetail.receivedAmount = 0;
            if ((assignServiceDetail.pin == null || assignServiceDetail.pin == 0)) {
                this.configuration.ShowAlertMessage("Ingrese un valor para el pin");
                return;
            }
        }

        if (assignServiceDetail.dateVisit == null || assignServiceDetail.dateVisit == "") {
            this.configuration.ShowAlertMessage("Ingrese un valor para la fecha de visita");
            return;
        }
        if (!this.validateDateVisit(assignServiceDetail.dateVisit)) {
            this.configuration.ShowAlertMessage("La fecha no puede ser mayor a hoy");
            return;
        }
        assignServiceDetail.stateId = 2;
        this.configuration.ShowLoading();
        let serviceDetailArray: AssignServiceDetail[] = [];
        serviceDetailArray[0] = assignServiceDetail;
        this.assignServiceDetailService.update(assignServiceDetail.assignServiceId, serviceDetailArray)
            .subscribe((res) => {
                if (res.success) {
                    this.viewProfessionalServiceDetail(this.currentAssignService);
                    this.alertService.clean(null);
                    this.configuration.ShowAlertMessage("Se guardaron los datos correctamente.");
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            })
    }
    private validateDateVisit(dateValue: string): boolean {

        var dateTemp: Date = new Date(dateValue);
        var currentDate: Date = new Date();

        if (dateTemp > currentDate) {
            return false;
        }
        return true;
    }
    private goBack(): void {
        this.inReadMode = true;
        this.inEditMode = false;
        this.loadAssignedServices();
        this.loadCompletedServices();
    }
}