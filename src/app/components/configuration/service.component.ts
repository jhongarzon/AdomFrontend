import { Component, OnInit,AfterViewInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { ParameterService } from '../../services/parameter.service';
import { Service } from '../../models/service';
import { SelectItem } from '../../models/selectItem';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import {  AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
declare var $: any

@Component({
    selector: 'service',
    templateUrl: 'service.component.html'
})

export class ServiceComponent implements OnInit, AfterViewInit {
    public services: Service[] = [];
    public classification: Parameter[] = [];
    public serviceType: Parameter[] = [];
    public classificationSelect: SelectItem[] = [];
    public serviceTypeSelect: SelectItem[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public inCreateMode: boolean = false;
    public currentService: Service;

    constructor(private service: ServiceService, private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private configuration: Config, private parameterService: ParameterService) {
        this.currentService = new Service();
    }

    public edit(Service: Service): void {
        this.currentService = Service;
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(Service: Service): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.currentService = new Service();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }


    public save(): void {
        if (!this.inEditMode) {
            this.saveNewService();
        } else {
            this.updateService();
        }
    }

    private saveNewService(): void {
        this.service.create(this.currentService)
            .subscribe((res) => {
                if (res.success) {
                    this.services.push(res.result);
                    this.currentService = new Service();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadServices();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updateService(): void {
        this.service.update(this.currentService)
            .subscribe((res) => {
                if (res.success) {
                    this.currentService = new Service();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadServices();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            })
    }

    private loadServices(): void {
        this.services = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.services = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private loadClassification(): void {
        this.classification = [];
        this.parameterService.getData("classification")
            .subscribe((res) => {
                if (res.success) {
                    this.classificationSelect = this.convertParameterSelectitem(res.result);
                    this.classification = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private loadServiceType(): void {
        this.serviceType = [];
        this.parameterService.getData("serviceType")
            .subscribe((res) => {
                if (res.success) {
                    this.serviceTypeSelect = this.convertParameterSelectitem(res.result);
                    this.serviceType = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/Service/Get");  
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Service/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Service/Edit");
        this.loadServices();
        this.loadClassification();
        this.loadServiceType();
    }

    public ngAfterViewInit() {
        $('#classification').material_select(); 
    }

    private convertParameterSelectitem(values:Parameter[]):any{
        let select: SelectItem[] = [];
        
        for (var i = 0; i < values.length; i++) {
            let item = new SelectItem(); 
            item.label = values[i].name;
            item.value = values[i].id.toString();
            select[i] = item;
        }

        return select;
    }
}