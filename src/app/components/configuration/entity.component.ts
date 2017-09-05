import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { PlanEntityService } from '../../services/planEntity.service';
import { PlanRateService } from '../../services/planRate.service';
import { ParameterService } from '../../services/parameter.service';
import { ServiceService } from '../../services/service.service';
import { Entity } from '../../models/entity';
import { PlanEntity } from '../../models/planEntity';
import { PlanRate } from '../../models/planRate';
import { Service } from '../../models/service';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { DatePipe } from '@angular/common';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

declare var $: any


@Component({
    selector: 'entity',
    templateUrl: 'entity.component.html'
})

export class EntityComponent implements OnInit {
    public entities: Entity[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission: boolean = false;
    public onEditPermission: boolean = false;
    public onReadPlanRatePermission: boolean = false;
    public onCreatePlanRatePermission: boolean = false;
    public inCreateMode: boolean = false;
    public displayPlanRate: boolean = false;
    public validActivePlanEntity: boolean = false;
    public onSelectedValuePlanEntity: boolean = false;
    public currentEntity: Entity;
    public currencyPlanEntityId: number;
    public currentPlanEntity: PlanEntity;
    public currentPlanRate: PlanRate;
    public plansEntity: PlanEntity[] = [];
    public plansRates: PlanRate[] = [];
    public services: Service[] = [];
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };

    constructor(private service: EntityService, private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private configuration: Config, private parameterService: ParameterService,
        private servicePlanEntity: PlanEntityService, private servicePlanRate: PlanRateService,
        private serviceService: ServiceService) {
        this.currentEntity = new Entity();
        this.currentPlanEntity = new PlanEntity();
        this.currentPlanRate = new PlanRate();
        let currentDate = new Date();
        let today = {
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                day: currentDate.getDate()
            }
        };
        let datePipe = new DatePipe("es-CO");
        this.currentPlanRate.validity = datePipe.transform(currentDate, 'dd/MM/yyyy');
        this.currentPlanRate.validityObj = today;

    }

    public edit(Entity: Entity): void {
        this.currentEntity = Entity;
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(entity: Entity): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
        this.currentEntity = new Entity();
    }

    public cancel(): void {
        this.currentEntity = new Entity();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }

    public save(): void {
        if (!this.inEditMode) {
            this.saveNewEntity();
        } else {
            this.updateEntity();
        }
    }

    public updatePlanEntity(state: boolean): void {
        this.currentPlanEntity = this.plansEntity.filter(planEntity => planEntity.planEntityId === this.currencyPlanEntityId)[0];
        this.currentPlanEntity.state = state;
        this.servicePlanEntity.update(this.currentPlanEntity)
            .subscribe((res) => {
                if (res.success) {
                    this.loadPlansEntity(this.currentEntity);
                    this.alertService.clean(null);
                    this.currentPlanEntity = new PlanEntity();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    public deletePlanRate(planRate: PlanRate): void {
        this.servicePlanRate.delete(planRate)
            .subscribe((res) => {
                if (res.success) {
                    this.loadPlansRates();
                    this.alertService.clean(null);
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    public savePlanEntity(): void {
        this.configuration.ShowLoading();
        this.currentPlanEntity.entityId = this.currentEntity.entityId;
        this.currentPlanEntity.state = true;
        this.servicePlanEntity.create(this.currentPlanEntity)
            .subscribe((res) => {
                if (res.success) {
                    this.loadPlansEntity(this.currentEntity);
                    this.alertService.clean(null);
                    this.currentPlanEntity = new PlanEntity();
                    this.configuration.ShowAlertMessage('Se creó correctamente.');
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    public viewPlansRates(entity: Entity): void {
        this.configuration.ShowLoading();
        this.displayPlanRate = true;
        this.loadPlansEntity(entity);
        this.currentEntity = entity;

    }

    public loadPlanRate(planEntityId: number): void {
        if (typeof (planEntityId) != 'undefined') {
            this.onSelectedValuePlanEntity = true;
            this.currencyPlanEntityId = planEntityId;
            let planEntity = this.plansEntity.filter(planEntity => planEntity.planEntityId === planEntityId)[0];
            this.loadServices();
            this.loadPlansRates();

            if (planEntity.state == true) {
                this.validActivePlanEntity = true;
            }
            else {
                this.validActivePlanEntity = false;
            }
        }
    }

    public savePlanRate(): void {
        if(this.currentPlanRate.rate < 1){
            this.alertService.error("La tarifa debe ser mayor a cero");
            return;
        }
        this.currentPlanRate.planEntityId = this.currentPlanEntity.planEntityId;
        this.servicePlanRate.create(this.currentPlanRate)
            .subscribe((res) => {
                if (res.success) {
                    this.alertService.clean(null);
                    this.loadPlansRates();
                    this.currentPlanRate = new PlanRate();
                    this.currentPlanRate.rate = 0;
                    let currentDate = new Date();                    
                    let datePipe = new DatePipe("es-CO");
                    this.currentPlanRate.validity = datePipe.transform(currentDate, 'dd/MM/yyyy');
                    let today = {
                        date: {
                            year: currentDate.getFullYear(),
                            month: currentDate.getMonth() + 1,
                            day: currentDate.getDate()
                        }
                    };
                    this.currentPlanRate.validityObj = today;
                    this.loadServices();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private saveNewEntity(): void {
        this.service.create(this.currentEntity)
            .subscribe((res) => {
                if (res.success) {
                    this.entities.push(res.result);
                    this.currentEntity = new Entity();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadEntities();

                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    private updateEntity(): void {
        this.service.update(this.currentEntity)
            .subscribe((res) => {
                if (res.success) {
                    this.currentEntity = new Entity();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadEntities();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            })
    }

    private loadEntities(): void {
        this.entities = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.entities = res.result;

                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    private loadServices(): void {
        this.services = [];
        this.serviceService.getAllWithoutPagination()
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

    private loadPlansRates(): void {
        this.plansRates = [];
        this.servicePlanRate.getByEntityId(this.currencyPlanEntityId)
            .subscribe((res) => {
                if (res.success) {
                    this.plansRates = res.result;                    
                    this.alertService.clean(null);

                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
            });
    }

    private loadPlansEntity(entity: Entity): void {
        this.plansEntity = [];
        this.servicePlanEntity.getByEntityId(entity.entityId)
            .subscribe((res) => {
                if (res.success) {
                    this.plansEntity = res.result;
                    this.alertService.clean(null);
                    this.onSelectedValuePlanEntity = false;

                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
                this.configuration.CloseLoading();
            });
    }

    public ngOnInit() {
        this.configuration.ShowLoading();
        this.authenticationService.isAuthorize("/Entity/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Entity/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Entity/Edit");
        this.onReadPlanRatePermission = this.authenticationService.hasPermissionResourceAction("/PlanRate/Get");
        this.onCreatePlanRatePermission = this.authenticationService.hasPermissionResourceAction("/PlanRate/Create");
        this.loadEntities();

        this.configuration.ConfigHeightModals();


    }
    public onValidityDateChanged(event: IMyDateModel) {        
        this.currentPlanRate.validity = event.formatted;
    }
}
