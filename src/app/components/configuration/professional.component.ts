import { Component, OnInit } from '@angular/core';
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

    constructor(private service: ProfessionalService, private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private configuration: Config, private parameterService: ParameterService) {
        this.currentProfessional = new Professional();
        let currentDate = new Date();
        let datePipe = new DatePipe("es-CO");
        this.currentProfessional.birthDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
        this.currentProfessional.dateAdmission =  datePipe.transform(currentDate, 'dd/MM/yyyy');
    }

    public edit(professional: Professional): void {
        this.currentProfessional = professional;
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
        debugger;
        this.currentProfessional.birthDate = event.formatted;
    }
    public onAdmissionDateChanged(event: IMyDateModel) {
        debugger;
        this.currentProfessional.dateAdmission = event.formatted;
    }
}
