import { Component, OnInit } from '@angular/core';
import { CopaymentService } from '../../services/copayment.service';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { Copayment } from '../../models/copayment';
import { Professional } from '../../models/professional';
import { FieldsetModule } from 'primeng/primeng';
import { SelectItem } from '../../models/selectItem';
import { CopaymentFilter } from '../../models/copaymentFilter';
import { PatientService } from '../../services/patient.service';
import { ProfessionalService } from '../../services/professional.service';
import { Patient } from '../../models/patient';


declare var $: any
declare var jQuery: any


@Component({
    selector: 'copaymentService',
    templateUrl: 'copaymentService.component.html'
})

export class CopaymentServicesComponent implements OnInit {
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public copayments: Copayment[] = [];
    public userId: number;
    public currentCopayment: Copayment;
    public copaymentStatuses: SelectItem[] = [];
    public serviceStatuses: SelectItem[] = [];
    public professionalList: Professional[];
    public currentProfessional: Professional;
    public professionals: SelectItem[] = [];
    public copaymentFilter: CopaymentFilter;
    public hasSearchPermission: boolean = false;
    public hasEditPermission: boolean = false;

    public selectedCopayments: Copayment[];
    public displayPreview: boolean = false;
    public formattedDate: string;


    constructor(private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private configuration: Config,
        private copaymentService: CopaymentService,
        private patientService: PatientService,
        private professionalService: ProfessionalService) {

    }
    ngOnInit(): void {
        this.authenticationService.isAuthorize("/Copayment/Get");
        this.hasSearchPermission = this.authenticationService.hasPermissionResourceAction("/Copayment/Get");
        this.hasEditPermission = this.authenticationService.hasPermissionResourceAction("/Copayment/Edit");
        this.copaymentStatuses = this.loadCopaymentStatuses();
        this.serviceStatuses = this.loadServiceStatuses();
        this.loadProfessionals();
        this.copaymentFilter = new CopaymentFilter();
        let currentDate = new Date();
        this.formattedDate = currentDate.getFullYear().toString() + "/" + currentDate.getMonth().toString() + "/" + currentDate.getDate().toString();
        this.currentProfessional = new Professional();

    }

    private loadCopayments(): void {
        this.copayments = [];

        this.copaymentService.getCopayments(this.copaymentFilter.professionalId, this.copaymentFilter.serviceStatusId, this.copaymentFilter.copaymentStatusId)
            .subscribe((res) => {
                if (res.success) {
                    this.copayments = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public loadServiceStatuses(): any {
        let items: SelectItem[] = [];

        let completed = new SelectItem();
        completed.value = "2";
        completed.label = "Completado";

        let inProcess = new SelectItem();
        inProcess.value = "1";
        inProcess.label = "En proceso";

        let all = new SelectItem();
        all.value = "3";
        all.label = "Todos";

        items[0] = completed;
        items[1] = inProcess;
        items[2] = all;
        return items;
    }
    public loadCopaymentStatuses(): any {
        let items: SelectItem[] = [];

        let completed = new SelectItem();
        completed.value = "1";
        completed.label = "Entregado";

        let inProcess = new SelectItem();
        inProcess.value = "2";
        inProcess.label = "Sin entregar";

        let all = new SelectItem();
        all.value = "3";
        all.label = "Todos";

        items[0] = completed;
        items[1] = inProcess;
        items[2] = all;
        return items;
    }
    public loadProfessionals() {
        this.professionalService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.professionalList = res.result;
                    this.professionals = this.convertProfessionalSelectitem(this.professionalList);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }
    private convertProfessionalSelectitem(values: Professional[]): any {
        let select: SelectItem[] = [];
        let item1 = new SelectItem();
        item1.label = "Por Asignar";
        item1.value = "-1";
        select[0] = item1;

        for (var i = 0; i < values.length; i++) {
            let j = i + 1;
            let item = new SelectItem();
            item.label = values[i].firstName + (values[i].secondName == null ? " " : " " + values[i].secondName + " ") + values[i].surname + (values[i].secondSurname == null ? "" : " " + values[i].secondSurname);
            item.value = values[i].professionalId.toString();
            select[j] = item;
        }

        return select;
    }
    public professionalChanged(professionalId: number): void {
        if (typeof (professionalId) != 'undefined') {
            this.currentProfessional = this.professionalList.find(x => x.professionalId == professionalId);
        }
    }
    public showPreview(): void {
        if (this.selectedCopayments == null) {
            this.alertService.error("Seleccione un registro");
            return;
        }
        let hasErrors = false;
        this.selectedCopayments.forEach(element => {
            if (element != null) {
                if (element.valueToPayToProfessional == null || element.valueToPayToProfessional < 1) {
                    this.alertService.error("El valor a pagar al profesional no se encuentra configurado correctamente Aut:" + element.authorizationNumber);
                    hasErrors = true;
                    return;
                }
                if (element.quantityCompleted == null || element.quantityCompleted < 1) {
                    this.alertService.error("La cantidad de servicios completados es inválida Aut:" + element.authorizationNumber);
                    hasErrors = true;
                    return;
                }
                if (element.totalCopaymentReported == null || element.totalCopaymentReported < 1) {
                    this.alertService.error("Debe diligenciar el total de copagos reportados Aut:" + element.authorizationNumber);
                    hasErrors = true;
                    return;
                }
                if (element.totalCopaymentReceived == null || element.totalCopaymentReceived < 0) {
                    this.alertService.error("El total recibido es inválido:" + element.authorizationNumber);
                    hasErrors = true;
                    return;
                }
                if (element.otherValuesReported == null) {
                    element.otherValuesReported = 0;
                }
                if (element.discounts == null) {
                    element.discounts = 0;
                }

                element.grandTotalToPay = (element.valueToPayToProfessional * element.quantityCompleted) -
                    (element.totalCopaymentReported) + Number(element.totalCopaymentReceived) + Number(element.otherValuesReported) - Number(element.discounts);
            }
        });
        if (!hasErrors) {
            this.displayPreview = true;
        }
    }
    public hideDialog(): void {
        this.displayPreview = false;
        this.selectedCopayments
    }
    public saveChanges() {
        this.selectedCopayments.forEach(element => {
            let counter = 0;
            this.copaymentService.markAsDelivered(element)
                .subscribe((res) => {
                    if (res.success) {
                        this.currentCopayment = res.result;
                        if (this.currentCopayment == null) {
                            this.alertService.error("Error al actualizar el registro");
                            return;
                        }
                        if (this.currentCopayment.assignServiceId == 0) {
                            this.alertService.error("Error al actualizar el registro Aut:" + this.currentCopayment.authorizationNumber);
                            return;
                        }

                    } else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }
                });
            counter++;
            if (counter == this.selectedCopayments.length) {
                this.displayPreview = false;                
                this.loadCopayments();
                this.alertService.error("Datos actualizados correctamente");
            }
        });


    }
}