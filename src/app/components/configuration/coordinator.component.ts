import { Component, OnInit } from '@angular/core';
import { CoordinatorService } from '../../services/coordinator.service';
import { ParameterService } from '../../services/parameter.service';
import { Coordinator } from '../../models/coordinator';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import {  AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

@Component({
    selector: 'coordinators',
    templateUrl: 'coordinator.component.html'
})

export class CoordinatorComponent implements OnInit {
    public coordinators: Coordinator[] = [];
    public documentType: Parameter[] = [];
    public gender: Parameter[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public inCreateMode: boolean = false;
    public currentCoordinator: Coordinator;
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };
    constructor(private service: CoordinatorService, private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private configuration: Config, private parameterService: ParameterService) {
        this.currentCoordinator = new Coordinator();
        let currentDate = new Date();
        let today = {
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                day: currentDate.getDate()
            }
        };
        this.currentCoordinator.birthDateObj = today;
        let datePipe = new DatePipe("es-CO");
        this.currentCoordinator.birthDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
    }

    public edit(Coordinator: Coordinator): void {
        this.currentCoordinator = Coordinator;
        if (Coordinator.birthDate != null) {
            var birthDayParts = Coordinator.birthDate.split("-");
            if (birthDayParts.length == 3) {
                let birthday = {
                    date: {
                        year: parseInt(birthDayParts[2]),
                        month: parseInt(birthDayParts[1]),
                        day: parseInt(birthDayParts[0])
                    }
                };
                this.currentCoordinator.birthDateObj = birthday;
            }
        }
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(Coordinator: Coordinator): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.loadCoordinators();
        this.currentCoordinator = new Coordinator();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }


    public save(): void {
        if (!this.inEditMode) {
            this.saveNewCoordinator();
        } else {
            this.updateCoordinator();
        }
    }

    public ValidateFutureDate(date: Date) : void {
        let todayDate= new Date();
        let dateValue = new Date(date);

        if(dateValue > todayDate){
            this.alertService.error("Debe diligenciar una fecha inferior o igual a hoy");
            date = null;
        }
        else{
            this.alertService.success(null);
        }
    }

    private saveNewCoordinator(): void {
        
        this.service.create(this.currentCoordinator)
            .subscribe((res) => {
                
                if (res.success) {
                    this.coordinators.push(res.result);
                    this.currentCoordinator = new Coordinator();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.alertService.success("Datos almacenados correctamente");
                    this.loadCoordinators();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updateCoordinator(): void {
        this.service.update(this.currentCoordinator)
            .subscribe((res) => {
                if (res.success) {
                    this.currentCoordinator = new Coordinator();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.alertService.success("Datos almacenados correctamente");
                    this.loadCoordinators();
                    
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            })
    }

    private loadCoordinators(): void {
        this.coordinators = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.coordinators = res.result;
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

    public ngOnInit() {
        this.authenticationService.isAuthorize("/Coordinator/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Coordinator/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Coordinator/Edit");
        this.loadCoordinators();
        this.loadDocumentType();
        this.loadGender();
    }
    public onBirthdayChanged(event: IMyDateModel) {
        this.currentCoordinator.birthDate = event.formatted;
    }
}
