import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { ParameterService } from '../../services/parameter.service';
import { Patient } from '../../models/patient';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'patient',
    templateUrl: 'patient.component.html'
})

export class PatientComponent implements OnInit {
    public patients: Patient[] = [];
    public unitTime: Parameter[] = [];
    public documentType: Parameter[] = [];
    public gender: Parameter[] = [];
    public patientType: Parameter[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public documentIsValid: boolean = false;
    public onCreatePermission: boolean = false;
    public onEditPermission: boolean = false;
    public inCreateMode: boolean = false;
    public currentPatient: Patient;
    public documentToEdit: string = "";
    public documentTypeToEdit: number = 0;
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };

    constructor(private service: PatientService, private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private configuration: Config, private parameterService: ParameterService) {
        this.currentPatient = new Patient();
        let currentDate = new Date();
    }

    public edit(Patient: Patient): void {
        this.currentPatient = Patient;
        this.documentToEdit = Patient.document;
        this.documentTypeToEdit = Patient.documentTypeId;
        this.inEditMode = true;
        this.documentIsValid = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(Patient: Patient): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.loadPatients();
        this.currentPatient = new Patient();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }

    public save(): void {
        if (!this.inEditMode) {
            this.saveNewPatient();
        } else {
            this.updatePatient();
        }
    }

    public findDocument(): void {
        if (this.currentPatient != null && this.currentPatient.documentTypeId > 0 && this.currentPatient.document == undefined) {
            return;
        }
        if (this.inEditMode && this.currentPatient.document == this.documentToEdit && this.currentPatient.documentTypeId == this.documentTypeToEdit) {
            return;
        }
        if (this.currentPatient != null && this.currentPatient.document != undefined) {

            this.service.getByDocument(this.currentPatient.documentTypeId, this.currentPatient.document)
                .subscribe((res) => {
                    if (res.success) {
                        if (res.result.length > 0) {
                            this.documentIsValid = false;
                            this.alertService.error("El documento ya existe.");
                        }
                        else {
                            this.documentIsValid = true;
                            this.alertService.clean(null);
                        }
                    } else {
                        this.documentIsValid = false;
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }
                });
        } else {
            this.alertService.error("Seleccione un tipo de documento");
        }
    }

    public calculateAge(event: IMyDateModel): void {
        
        let dateArray = event.formatted.split('/');
        let date = new Date(parseInt(dateArray[2]), parseInt(dateArray[1]) - 1, parseInt(dateArray[0]));

        this.currentPatient.birthDate = date;
        this.ValidateFutureDate(this.currentPatient.birthDate);
        let birthDate = new Date(this.currentPatient.birthDate);
        let birthMonth = birthDate.getMonth();
        let birthDay = birthDate.getDay();
        let todayDate = new Date();
        let todayYear = todayDate.getFullYear();
        let todayMonth = todayDate.getMonth();
        let todayDay = todayDate.getDate();
        let age = todayYear - birthDate.getFullYear();

        if (todayMonth < birthMonth - 1) {
            age--;
        }

        if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
            age--;
        }

        this.currentPatient.age = age;
    }

    public ValidateFutureDate(date: Date): void {
        let todayDate = new Date();
        let dateValue = new Date(date);

        if (dateValue > todayDate) {
            this.alertService.error("Debe diligenciar una fecha inferior o igual a hoy");
            date = null;
        }
        else {
            this.alertService.clean(null);
        }
    }

    private saveNewPatient(): void {
        if (!this.documentIsValid) {
            this.alertService.error("El documento ingresado ya existe en el sistema");
            return;
        }
        this.service.create(this.currentPatient)
            .subscribe((res) => {
                if (res.success) {
                    this.patients.push(res.result);
                    this.currentPatient = new Patient();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadPatients();
                    this.alertService.clean(null);
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updatePatient(): void {
        if (this.currentPatient.document == this.documentToEdit && this.currentPatient.documentTypeId == this.documentTypeToEdit) {
            this.documentIsValid = true;
        }
        if (!this.documentIsValid) {
            this.alertService.error("El documento ingresado ya existe en el sistema");
            return;
        }
        this.service.update(this.currentPatient)
            .subscribe((res) => {
                if (res.success) {
                    this.currentPatient = new Patient();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadPatients();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private loadPatients(): void {
        this.patients = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.patients = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private loadDocumentType(): void {
        this.documentType = [];
        this.parameterService.getData("documentType")
            .subscribe((res) => {
                if (res.success) {
                    this.documentType = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private loadGender(): void {
        this.gender = [];
        this.parameterService.getData("gender")
            .subscribe((res) => {
                if (res.success) {
                    this.gender = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private loadUnitTime(): void {
        this.unitTime = [];
        this.parameterService.getData("unitTime")
            .subscribe((res) => {
                if (res.success) {
                    this.unitTime = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private loadPatientType(): void {
        this.patientType = [];
        this.parameterService.getData("patientType")
            .subscribe((res) => {
                if (res.success) {
                    this.patientType = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/Patient/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Patient/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Patient/Edit");
        this.loadPatients();
        this.loadDocumentType();
        this.loadGender();
        this.loadUnitTime();
        this.loadPatientType();
    }
}
