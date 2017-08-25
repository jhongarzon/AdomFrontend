import { Component, OnInit } from '@angular/core';
import { ServiceFrecuencyService } from '../../services/serviceFrecuency.service';
import { ParameterService } from '../../services/parameter.service';
import { ServiceFrecuency } from '../../models/serviceFrecuency';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";

@Component({
    selector: 'serviceFrecuency',
    templateUrl: 'serviceFrecuency.component.html'
})

export class ServiceFrecuencyComponent implements OnInit {
    public servicesFrecuency: ServiceFrecuency[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public inCreateMode: boolean = false;
    public currentServiceFrecuency: ServiceFrecuency;

    constructor(private service: ServiceFrecuencyService, private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private configuration: Config, private parameterService: ParameterService) {
        this.currentServiceFrecuency = new ServiceFrecuency();
    }

    public edit(ServiceFrecuency: ServiceFrecuency): void {
        this.currentServiceFrecuency = ServiceFrecuency;
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(ServiceFrecuency: ServiceFrecuency): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.currentServiceFrecuency = new ServiceFrecuency();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }


    public save(): void {
        if (!this.inEditMode) {
            this.saveNewServiceFrecuency();
        } else {
            this.updateServiceFrecuency();
        }
    }

    private saveNewServiceFrecuency(): void {
        this.service.create(this.currentServiceFrecuency)
            .subscribe((res) => {
                if (res.success) {
                    this.servicesFrecuency.push(res.result);
                    this.currentServiceFrecuency = new ServiceFrecuency();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadServicesFrecuency();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updateServiceFrecuency(): void {
        this.service.update(this.currentServiceFrecuency)
            .subscribe((res) => {
                if (res.success) {
                    this.currentServiceFrecuency = new ServiceFrecuency();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadServicesFrecuency();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            })
    }

    private loadServicesFrecuency(): void {
        this.servicesFrecuency = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.servicesFrecuency = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/ServiceFrecuency/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/ServiceFrecuency/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/ServiceFrecuency/Edit");
        this.loadServicesFrecuency();
    }
}
