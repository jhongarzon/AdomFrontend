import { Component, OnInit } from '@angular/core';
import { AssignServiceService } from '../../services/assignService.service';
import { AssignService } from '../../models/assignService';
import { ParameterService } from '../../services/parameter.service';
import { AssignServiceDetailService } from '../../services/assignServiceDetail.service';
import { AssignServiceDetail } from '../../models/assignServiceDetail';
import { AssignServiceSupplyService } from '../../services/assignServiceSupply.service';
import { AssignServiceSupply } from '../../models/assignServiceSupply';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { SelectItem } from '../../models/selectItem';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service';
import { SupplyService } from '../../services/supply.service';
import { Supply } from '../../models/supply';
import { ServiceFrecuencyService } from '../../services/serviceFrecuency.service';
import { ServiceFrecuency } from '../../models/serviceFrecuency';
import { ProfessionalService } from '../../services/professional.service';
import { Professional } from '../../models/professional';
import { EntityService } from '../../services/entity.service';
import { Entity } from '../../models/entity';
import { PlanEntityService } from '../../services/planEntity.service';
import { PlanEntity } from '../../models/planEntity';
import { CoPaymentFrecService } from '../../services/coPaymentFrec.service';
import { CoPaymentFrecuency } from '../../models/coPaymentFrecuency';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { FieldsetModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { QualityQuestion } from '../../models/qualityQuestion';
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

declare var $: any
declare var jQuery: any


@Component({
    selector: 'assignServices',
    templateUrl: 'assignService.component.html'
})

export class AssignServiceComponent implements OnInit {
    public assignServices: AssignService[] = [];
    public lastAssignServices: AssignService;
    public assignServicesDetail: AssignServiceDetail[] = [];
    public assignServicesDetailObservation: AssignServiceDetail[] = [];
    public assignServiceDetailObservation: AssignServiceDetail;
    public assignServicesSupply: AssignServiceSupply[] = [];
    public selectedDetails: AssignServiceDetail[] = [];
    public patientsFound: Patient[] = [];
    public currentPatient: Patient;
    public findPatient: string;
    public services: Service[] = [];
    public serviceFrecuency: ServiceFrecuency[] = [];
    public professionals: Professional[] = [];
    public coPaymentsFrecuency: CoPaymentFrecuency[] = [];
    public supplies: Supply[] = [];
    public entities: Entity[] = [];
    public plansEntity: PlanEntity[] = [];
    public assignServiceSupplyTemp: AssignServiceSupply;
    public stateAssignDetail: Parameter[] = [];
    public billedTo: Parameter[] = [];
    public professionalsSelect: SelectItem[] = [];
    public stateDetailSelect: SelectItem[] = [];
    public inFoundMode: boolean = false;
    public inSearchMode: boolean = true;
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission: boolean = false;
    public onEditPermission: boolean = false;
    public onReadPermission: boolean = false;
    public inCreateMode: boolean = false;
    public displayNewService: boolean = false;
    public displayEditService: boolean = false;
    public displayEditPatient: boolean = false;
    public displayNewSupply: boolean = false;
    public displayEditDetailService: boolean = false;
    public inServiceSelectMode: boolean = false;
    public displayObservationService: boolean = false;
    public currentAssignService: AssignService;
    public rowsRecords: number;
    public quantityTemp: number;
    public serviceFrecuencyIdTemp: number;
    public initialDateTemp: string;
    public unitTime: Parameter[] = [];
    public documentType: Parameter[] = [];
    public gender: Parameter[] = [];
    public patientType: Parameter[] = [];
    public validity: string;
    public initialDate: string;
    public finalDate: string;
    public oldValueState: string;
    private displayQualityTest: boolean = false;
    private qualityQuestions: QualityQuestion[] = [];
    public scoreItems: SelectItem[] = [];
    public selectedScores: number[] = [];
    private qualityTestAssingDetailServiceId: number;

    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };

    constructor(private service: AssignServiceService, private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private configuration: Config, private parameterService: ParameterService,
        private patientService: PatientService, private serviceService: ServiceService,
        private professionalService: ProfessionalService, private coPaymentFrecService: CoPaymentFrecService,
        private supplyService: SupplyService, private serviceFrecuencyService: ServiceFrecuencyService,
        private serviceDetail: AssignServiceDetailService, private serviceSupply: AssignServiceSupplyService,
        private entityService: EntityService, private planEntityService: PlanEntityService) {

        this.currentAssignService = new AssignService();
        this.currentPatient = new Patient();
        this.assignServiceSupplyTemp = new AssignServiceSupply();
        this.assignServiceDetailObservation = new AssignServiceDetail();
        this.quantityTemp = 0;
        this.serviceFrecuencyIdTemp = 0;
        this.initialDateTemp = null;
        this.findPatient = " ";
        this.loadPatients();
        this.findPatient = "";
        this.loadScores();
        let currentDate = new Date();
        let datePipe = new DatePipe("es-CO");
        this.currentAssignService.validity = datePipe.transform(currentDate, 'dd/MM/yyyy');
        this.currentAssignService.initialDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
        this.currentAssignService.finalDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
        this.currentPatient.birthDate = currentDate;
    }

    public edit(): void {
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
        this.displayEditService = true;
    }

    public create(): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
        this.displayNewService = true;
        this.loadProfessionals();
        this.loadCoPaymentFrecuency();
        this.loadSupplies();
        this.loadBilledTo();
        this.loadServiceFrecuency();
        this.loadEntities();
        this.currentAssignService = new AssignService();
        this.lastAssignServices = this.getLastAssignService();
        if (this.lastAssignServices != undefined) {
            this.currentAssignService.contractNumber = this.lastAssignServices.contractNumber;
            this.currentAssignService.cie10 = this.lastAssignServices.cie10;
            this.currentAssignService.entityId = this.lastAssignServices.entityId;
            this.currentAssignService.planEntityId = this.lastAssignServices.planEntityId;
            this.currentAssignService.descriptionCie10 = this.lastAssignServices.descriptionCie10;
        }

        this.currentAssignService.consultation = 10;
        this.currentAssignService.external = 13;
        this.loadPlans(this.currentAssignService.entityId);
        this.loadServices(this.currentAssignService.planEntityId);

    }

    public createSupply(): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
        this.displayNewSupply = true;
        this.loadSupplies();
        this.loadBilledTo();
        this.assignServiceSupplyTemp = new AssignServiceSupply();
    }

    public cancel(): void {
        this.loadAssignServices(this.currentPatient);
        this.currentAssignService = new AssignService();
        this.quantityTemp = 0;
        this.serviceFrecuencyIdTemp = 0;
        this.initialDateTemp = null;
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
        this.displayNewService = false;
        this.displayEditPatient = false;
    }

    public cancelEdit(): void {
        this.loadAssignServices(this.currentPatient);
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
        this.displayEditService = false;
    }

    public cancelSupply(): void {
        this.loadAssignServices(this.currentPatient);
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
        this.displayNewSupply = false;
    }

    public deleteSupplyService(assignServiceSupply: AssignServiceSupply): void {
        this.serviceSupply.delete(assignServiceSupply.assignServiceSupplyId, assignServiceSupply)
            .subscribe((res) => {
                if (res.success) {
                    this.loadAssignServicesSupply();
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    public save(): void {
        if (!this.inEditMode) {
            this.saveNewAssignService();
        } else {
            this.updateAssignService();
        }
    }

    public saveNewSupply(): void {
        this.assignServiceSupplyTemp.assignServiceId = this.currentAssignService.assignServiceId;
        this.serviceSupply.create(this.assignServiceSupplyTemp)
            .subscribe((res) => {
                if (res.success) {
                    this.loadAssignServicesSupply();
                    this.assignServiceSupplyTemp = new AssignServiceSupply();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadAssignServices(this.currentPatient);
                    this.displayNewSupply = false;
                    this.alertService.clean(null);
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    public cancelStateDetails(): void {
        this.configuration.ShowLoading();

        for (var i = 0; i < this.selectedDetails.length; i++) {
            this.selectedDetails[i].stateId = 3;
        }

        this.serviceDetail.update(this.currentAssignService.assignServiceId, this.selectedDetails)
            .subscribe((res) => {
                if (res != null) {
                    if (res.success) {
                        this.loadAssignServices(this.currentPatient);
                        this.loadAssignServicesDetail();
                        this.alertService.clean(null);
                        this.configuration.ShowAlertMessage('Se cancelaron las citas correctamente.');
                    }
                    else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }

                } else {
                    this.loadAssignServices(this.currentPatient);
                    this.loadAssignServicesDetail();
                    this.alertService.clean(null);
                }
                this.configuration.CloseLoading();
            })
    }

    public loadPlans(entityId: number): void {
        this.plansEntity = [];
        this.inFoundMode = false;
        this.planEntityService.getByEntityId(entityId)
            .subscribe((res) => {
                if (res.success) {
                    this.plansEntity = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    public onFocusState(eventFocus: any): void {

        this.oldValueState = eventFocus.currentTarget.value;
    }
    public onChangeStateService(eventSelected: any): void {
        if (eventSelected.currentTarget.value != this.oldValueState) {
            if (eventSelected.currentTarget.value == "1" && this.oldValueState == "3") {
                eventSelected.currentTarget.value = "3";
                this.configuration.ShowAlertMessage('No puede asignar este estado.');
            } else if (eventSelected.currentTarget.value == "1" && this.oldValueState == "2") {
                eventSelected.currentTarget.value = "2";
                this.configuration.ShowAlertMessage('No puede asignar este estado.');
            } else if (eventSelected.currentTarget.value == "2" && this.oldValueState == "3") {
                eventSelected.currentTarget.value = "3";
                this.configuration.ShowAlertMessage('No puede asignar este estado.');
            }
        }
    }

    public onChangeQuantity(quantity: number): void {
        this.quantityTemp = quantity;
        this.calculateFinalDateAssignService();
    }

    public onChangeServiceFrecuency(serviceFrecuencyId: number): void {
        this.serviceFrecuencyIdTemp = serviceFrecuencyId;
        this.calculateFinalDateAssignService();
    }

    public onChangeInitialDate(initialDate: string): void {
        if (this.validateDate(initialDate)) {
            this.initialDateTemp = initialDate;
            this.calculateFinalDateAssignService();
        }
        else {
            this.initialDate = null;
        }
    }

    public calculateFinalDateAssignService(): void {
        if (this.quantityTemp != 0 && this.serviceFrecuencyIdTemp != 0 && this.initialDateTemp != null) {
            this.service.calculateFinalDateAssignService(this.quantityTemp, this.serviceFrecuencyIdTemp, this.initialDateTemp)
                .subscribe((res) => {
                    if (res.success) {
                        this.currentAssignService.finalDate = res.result;
                    } else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }

                    this.configuration.CloseLoading();
                });
        }
    }

    public openEditPatient(): void {
        this.loadDocumentType();
        this.loadGender();
        this.loadUnitTime();
        this.loadPatientType();
        this.displayEditPatient = true;
    }

    public savePatient(): void {
        this.patientService.update(this.currentPatient)
            .subscribe((res) => {
                if (res.success) {
                    this.displayEditPatient = false;
                    this.loadPatient();
                    this.alertService.clean(null);
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    public loadServices(planEntityId: number): void {
        this.services = [];
        this.inFoundMode = false;
        this.serviceService.getByPlanEntityId(planEntityId)
            .subscribe((res) => {
                if (res.success) {
                    this.services = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    public validateDateInitial(dateValue: string): void {
        if (!this.validateDate(dateValue)) {
            this.initialDate = "";
            this.currentAssignService.initialDate = "";
        }
    }

    public validateDateFinal(dateValue: string): void {
        if (!this.validateDate(dateValue)) {
            this.finalDate = "";
            this.currentAssignService.finalDate = "";
        }
    }

    public validateDateValidity(dateValue: string): void {
        if (!this.validateDate(dateValue)) {
            this.validity = "";
            this.currentAssignService.validity = "";
        }
    }

    public validateDate(dateValue: string): boolean {
        var dateTemp: Date = new Date(dateValue);
        var datePlusOneMonth: Date = new Date();
        datePlusOneMonth.setDate(datePlusOneMonth.getDate() - 30);

        if (dateTemp.getTime() < datePlusOneMonth.getTime()) {
            //this.alertService.error("La fecha no puede ser superior a un mes..");
            return false;
        }
        else {
            //this.alertService.clean(null);
        }

        return true;
    }

    private updateDetails(): void {
        this.configuration.ShowLoading();
        this.currentAssignService.patientId = this.currentPatient.patientId;
        this.serviceDetail.update(this.currentAssignService.assignServiceId, this.assignServicesDetail)
            .subscribe((res) => {
                if (res.success) {
                    this.loadAssignServices(this.currentPatient);
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

    private saveNewAssignService(): void {
        if (this.validateDate(this.currentAssignService.validity) && this.validateDate(this.currentAssignService.initialDate) && this.validateDate(this.currentAssignService.finalDate)) {
            this.currentAssignService.patientId = this.currentPatient.patientId;
            this.service.create(this.currentAssignService)
                .subscribe((res) => {
                    if (res.success) {
                        this.currentAssignService = new AssignService();
                        this.quantityTemp = 0;
                        this.serviceFrecuencyIdTemp = 0;
                        this.initialDateTemp = null;
                        this.inEditMode = false;
                        this.inReadMode = true;
                        this.inCreateMode = false;
                        this.loadAssignServices(this.currentPatient);
                        this.displayNewService = false;
                        this.alertService.clean(null);
                    }
                    else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }

                    this.configuration.CloseLoading();
                });
        }
        else {
            this.alertService.error("Existen fechas superiores a un mes.");
        }
    }

    private getLastAssignService(): AssignService {
        let assingServiceIdHigher = 0;

        for (var i = 0; i < this.assignServices.length; i++) {
            if (assingServiceIdHigher < this.assignServices[i].assignServiceId) {
                assingServiceIdHigher = this.assignServices[i].assignServiceId;
            }
        }

        return this.assignServices.filter(assignServiceId => assignServiceId.assignServiceId === assingServiceIdHigher)[0];
    }

    private updateAssignService(): void {
        this.currentAssignService.patientId = this.currentPatient.patientId;
        this.service.update(this.currentAssignService)
            .subscribe((res) => {
                if (res.success) {
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadAssignServices(this.currentPatient);
                    this.displayEditService = false;
                    this.alertService.clean(null);
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            })
    }

    private loadAssignServices(patient: Patient): void {
        this.inSearchMode = false;
        this.inCreateMode = true;
        this.currentPatient = patient;
        this.assignServices = [];
        this.service.getByPatientId(patient.patientId)
            .subscribe((res) => {
                if (res.success) {
                    this.assignServices = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    private loadAssignServicesDetail(): void {
        this.inSearchMode = false;
        this.inCreateMode = true;
        this.assignServicesDetail = [];
        this.serviceDetail.getByAssignServiceId(this.currentAssignService.assignServiceId)
            .subscribe((res) => {
                if (res.success) {
                    debugger;
                    this.assignServicesDetail = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    private loadAssignServicesSupply(): void {
        this.inSearchMode = false;
        this.inCreateMode = true;
        this.assignServicesSupply = [];
        this.serviceSupply.getByAssignServiceId(this.currentAssignService.assignServiceId)
            .subscribe((res) => {
                if (res.success) {
                    this.assignServicesSupply = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    private onRowSelectAssignService(assignServiceObject: any): void {
        this.configuration.ShowLoading();
        this.currentAssignService = assignServiceObject.data;
        this.inEditMode = true;
        this.inServiceSelectMode = true;
        this.loadServices(this.currentAssignService.planEntityId);
        this.loadProfessionals();
        this.loadCoPaymentFrecuency();
        this.loadSupplies();
        this.loadBilledTo();
        this.loadServiceFrecuency();
        this.loadAssignServicesDetail();
        this.loadAssignServicesSupply();
        this.loadStateDetail();
        this.loadEntities();
    }

    private loadPatients(): void {
        this.patientsFound = [];
        this.inFoundMode = false;
        this.patientService.getByNamesOrDocument(this.findPatient)
            .subscribe((res) => {
                if (res.success) {
                    this.patientsFound = res.result;
                    this.inFoundMode = true;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    private loadPatient(): void {
        this.patientsFound = [];
        this.inFoundMode = false;
        this.patientService.getById(this.currentPatient.patientId)
            .subscribe((res) => {
                if (res.success) {
                    this.currentPatient = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadEntities(): void {
        this.entities = [];
        this.inFoundMode = false;
        this.entityService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.entities = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadProfessionals(): void {
        this.professionals = [];
        this.inFoundMode = false;
        this.professionalService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.professionalsSelect = this.convertProfessionalSelectitem(res.result);
                    this.professionals = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadSupplies(): void {
        this.supplies = [];
        this.inFoundMode = false;
        this.supplyService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.supplies = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadServiceFrecuency(): void {
        this.serviceFrecuency = [];
        this.inFoundMode = false;
        this.serviceFrecuencyService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.serviceFrecuency = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadCoPaymentFrecuency(): void {
        this.coPaymentsFrecuency = [];
        this.inFoundMode = false;
        this.coPaymentFrecService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.coPaymentsFrecuency = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadBilledTo(): void {
        this.billedTo = [];
        this.parameterService.getData("billedTo")
            .subscribe((res) => {
                if (res.success) {
                    this.billedTo = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    private loadStateDetail(): void {
        this.stateAssignDetail = [];
        this.parameterService.getData("stateAssignService")
            .subscribe((res) => {
                if (res.success) {
                    this.stateDetailSelect = this.convertParameterSelectitem(res.result);
                    this.stateAssignDetail = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }



    private convertParameterSelectitem(values: Parameter[]): any {
        let select: SelectItem[] = [];

        for (var i = 0; i < values.length; i++) {
            let item = new SelectItem();
            item.label = values[i].name;
            item.value = values[i].id.toString();
            select[i] = item;
        }

        return select;
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

    private loadDocumentType(): void {
        this.documentType = [];
        this.parameterService.getData("documentType")
            .subscribe((res) => {
                if (res.success) {
                    this.documentType = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }
    private loadScores() {

        let item1 = new SelectItem();
        item1.label = "Seleccione";
        item1.value = "-1";
        this.scoreItems[0] = item1;

        let item2 = new SelectItem();
        item2.label = "EXCELENTE";
        item2.value = "5";
        this.scoreItems[1] = item2;

        let item3 = new SelectItem();
        item3.label = "BUENO";
        item3.value = "4";
        this.scoreItems[2] = item3;

        let item4 = new SelectItem();
        item4.label = "REGULAR";
        item4.value = "3";
        this.scoreItems[3] = item4;

        let item5 = new SelectItem();
        item5.label = "MALO";
        item5.value = "2";
        this.scoreItems[4] = item5;

        let item6 = new SelectItem();
        item6.label = "DEFICIENTE";
        item6.value = "1";
        this.scoreItems[5] = item6;

        let item7 = new SelectItem();
        item7.label = "NO APLICA";
        item7.value = "0";
        this.scoreItems[6] = item7;
    }

    private loadGender(): void {
        this.gender = [];
        this.parameterService.getData("gender")
            .subscribe((res) => {
                if (res.success) {
                    this.gender = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadUnitTime(): void {
        this.unitTime = [];
        this.parameterService.getData("unitTime")
            .subscribe((res) => {
                if (res.success) {
                    this.unitTime = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private loadPatientType(): void {
        this.patientType = [];
        this.parameterService.getData("patientType")
            .subscribe((res) => {
                if (res.success) {
                    this.patientType = res.result;
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    public ngOnInit() {
        this.rowsRecords = this.configuration.get("pageSize");
        this.authenticationService.isAuthorize("/AssignService/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/AssignService/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/AssignService/Edit");
        this.onReadPermission = this.authenticationService.hasPermissionResourceAction("/AssignService/Get");

        this.configuration.ConfigHeightModals();
        this.oldValueState = "-1";
    }
    private verifyVisit(assignServiceDetail: AssignServiceDetail): void {
        let details: AssignServiceDetail[] = [];
        assignServiceDetail.verifiedBy = this.authenticationService.getUserId();
        details[0] = assignServiceDetail;
        this.configuration.ShowLoading();
        this.serviceDetail.update(assignServiceDetail.assignServiceDetailId, details)
            .subscribe((res) => {
                if (res != null) {
                    if (res.success) {

                        this.loadAssignServicesDetail();
                        this.alertService.clean(null);
                    }
                    else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }

                } else {
                    this.loadAssignServices(this.currentPatient);
                    this.loadAssignServicesDetail();
                    this.alertService.clean(null);
                }
                this.configuration.CloseLoading();
            })
    }
    public qualityTest(assignServiceDetail: AssignServiceDetail): void {
        debugger;
        this.qualityTestAssingDetailServiceId = assignServiceDetail.assignServiceDetailId;
        let assignService = this.assignServices.find(x => x.assignServiceId == assignServiceDetail.assignServiceId);
        if (assignService != null) {
            this.loadQualityQuestions(assignService.serviceId);
        } else {
            this.alertService.error("No se pudo obtener el servicio asociado");
        }

    }
    private loadQualityQuestions(serviceId: number): void {

        this.serviceDetail.getQualityQuestionsByService(serviceId)
            .subscribe((res) => {
                if (res != null) {
                    if (res.success) {
                        this.displayQualityTest = true;
                        this.qualityQuestions = res.result;
                        debugger;
                        this.alertService.clean(null);
                    }
                    else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }

                } else {
                    this.alertService.error("No existen preguntas para la evaluación");
                }
                this.configuration.CloseLoading();
            })
    }
    public saveQualityTest() {
        if (this.qualityQuestions == null) {
            this.alertService.error("No existen preguntas para calificar");
            return;
        }
        if (this.qualityQuestions.length < 1) {
            this.alertService.error("No existen preguntas para calificar");
            return;
        }
        if (this.qualityQuestions.find(x => x.answerId == "-1")) {
            this.alertService.error("Por favor conteste todas las preguntas");
            return;
        }
        this.serviceDetail.saveQualityTest(this.qualityTestAssingDetailServiceId, this.qualityQuestions)
            .subscribe((res) => {
                if (res != null) {
                    if (res.success) {
                        this.displayQualityTest = false;
                        this.qualityTestAssingDetailServiceId = 0;
                        this.loadAssignServicesDetail();
                        this.alertService.clean(null);
                    }
                    else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }

                } else {
                    this.alertService.error("Error al guardar las respuestas");
                }
                this.configuration.CloseLoading();
            })
    }
    public onValidityDateChanged(event: IMyDateModel) {
        this.currentAssignService.validity = event.formatted;
    }
    public onInitialDateChanged(event: IMyDateModel) {
        this.currentAssignService.initialDate = event.formatted;
    }
    public onFinalDateChanged(event: IMyDateModel) {
        this.currentAssignService.finalDate = event.formatted;
    }
    public onBirthdayChanged(event: IMyDateModel) {
        debugger;
        let date = new Date(event.formatted);
        this.currentPatient.birthDate = date;
    }
}
