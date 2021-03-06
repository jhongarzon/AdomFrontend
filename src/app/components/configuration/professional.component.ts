﻿import { Component, OnInit } from '@angular/core';
import { ProfessionalService } from '../../services/professional.service';
import { ParameterService } from '../../services/parameter.service';
import { Professional } from '../../models/professional';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

@Component({
    selector: 'Professionals',
    templateUrl: 'Professional.component.html'
})

export class ProfessionalComponent implements OnInit {
    public professionals: Professional[] = [];
    public accountType: Parameter[] = [];
    public documentType: Parameter[] = [];
    public gender: Parameter[] = [];
    public zones: Parameter[] = [];
    public specialities: Parameter[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission: boolean = false;
    public onEditPermission: boolean = false;
    public onActivePermission: boolean = false;
    public activeButton: boolean = false;
    public inCreateMode: boolean = false;
    public currentProfessional: Professional;
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };
    public documentToEdit: string = "";
    public documentTypeToEdit: number = 0;
    public documentIsValid: boolean = false;

    constructor(private service: ProfessionalService, private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private configuration: Config, private parameterService: ParameterService) {
        this.currentProfessional = new Professional();
        let currentDate = new Date();
        let today = {
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                day: currentDate.getDate()
            }
        };
        let datePipe = new DatePipe("es-CO");
        this.currentProfessional.birthDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
        this.currentProfessional.dateAdmission = datePipe.transform(currentDate, 'dd/MM/yyyy');
        this.currentProfessional.birthDateObj = today;
        this.currentProfessional.dateAdmissionObj = today;
    }
    public findDocument(): void {
        if (this.currentProfessional != null && this.currentProfessional.documentTypeId > 0 && this.currentProfessional.document == undefined) {
            return;
        }
        if (this.inEditMode && this.currentProfessional.document == this.documentToEdit && this.currentProfessional.documentTypeId == this.documentTypeToEdit) {
            return;
        }
        if (this.currentProfessional != null && this.currentProfessional.document != undefined) {

            this.service.getByDocument(this.currentProfessional.documentTypeId, this.currentProfessional.document)
                .subscribe((res) => {
                    if (res.success) {
                        if (res.result != null) {
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
    public edit(professional: Professional): void {
        this.currentProfessional = professional;
        this.documentToEdit = professional.document;
        this.documentTypeToEdit = professional.documentTypeId;
        this.documentIsValid = true;
        if (professional.birthDate != null) {
            var birthDayParts = professional.birthDate.split("-");
            if (birthDayParts.length == 3) {
                let birthday = {
                    date: {
                        year: parseInt(birthDayParts[2]),
                        month: parseInt(birthDayParts[1]),
                        day: parseInt(birthDayParts[0])
                    }
                };
                this.currentProfessional.birthDateObj = birthday;
            }
        }
        if (professional.dateAdmission != null) {
            var dateAdmissionParts = professional.dateAdmission.split("-");
            if (dateAdmissionParts.length == 3) {
                let dateAdmission = {
                    date: {
                        year: parseInt(dateAdmissionParts[2]),
                        month: parseInt(dateAdmissionParts[1]),
                        day: parseInt(dateAdmissionParts[0])
                    }
                };
                this.currentProfessional.dateAdmissionObj = dateAdmission;
            }
        }


        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(professional: Professional): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
        this.currentProfessional = new Professional();
    }

    public cancel(): void {
        this.loadProfessionals();
        this.currentProfessional = new Professional();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }


    public save(): void {

        if (!this.inEditMode) {
            this.saveNewProfessional();
        } else {
            this.updateProfessional();
        }
    }

    public active(professional: Professional): void {
        this.currentProfessional = professional;
        this.currentProfessional.state = true;
        this.updateProfessional();
    }

    public inactive(professional: Professional): void {
        this.currentProfessional = professional;
        this.currentProfessional.state = false;
        this.updateProfessional();
    }


    private saveNewProfessional(): void {
        if (!this.documentIsValid) {
            this.alertService.error("El documento ingresado ya existe en el sistema");
            return;
        }
        this.service.create(this.currentProfessional)
            .subscribe((res) => {
                if (res.success) {
                    this.professionals.push(res.result);
                    this.currentProfessional = new Professional();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadProfessionals();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updateProfessional(): void {
        if (this.currentProfessional.document == this.documentToEdit && this.currentProfessional.documentTypeId == this.documentTypeToEdit) {
            this.documentIsValid = true;
        }
        if (!this.documentIsValid) {
            this.alertService.error("El documento ingresado ya existe en el sistema");
            return;
        }
        this.service.update(this.currentProfessional)
            .subscribe((res) => {
                if (res.success) {
                    this.currentProfessional = new Professional();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadProfessionals();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            })
    }

    private loadProfessionals(): void {
        this.professionals = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.professionals = res.result;
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

    private loadSpecialties(): void {
        this.specialities = [];
        this.parameterService.getData("specialties")
            .subscribe((res) => {
                if (res.success) {
                    this.specialities = res.result;
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

    private loadAccountType(): void {
        this.accountType = [];
        this.parameterService.getData("accountType")
            .subscribe((res) => {
                if (res.success) {
                    this.accountType = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/Professional/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Professional/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Professional/Edit");
        this.onActivePermission = this.authenticationService.hasPermissionResourceAction("/Professional/Active");
        this.loadProfessionals();
        this.loadDocumentType();
        this.loadSpecialties();
        this.loadGender();
        this.loadAccountType();
    }
    public onBirthdayChanged(event: IMyDateModel) {
        this.currentProfessional.birthDate = event.formatted;
    }
    public onAdmissionDateChanged(event: IMyDateModel) {
        this.currentProfessional.dateAdmission = event.formatted;
    }
}
