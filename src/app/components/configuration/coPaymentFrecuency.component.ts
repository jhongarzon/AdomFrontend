import { Component, OnInit } from '@angular/core';
import { CoPaymentFrecService } from '../../services/coPaymentFrec.service';
import { ParameterService } from '../../services/parameter.service';
import { CoPaymentFrecuency } from '../../models/coPaymentFrecuency';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import {  AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
 
@Component({
    selector: 'coPaymentFrecuency',
    templateUrl: 'coPaymentFrecuency.component.html'
})

export class CoPaymentFrecuencyComponent implements OnInit {
    public coPaymentsFrecuency: CoPaymentFrecuency[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public inCreateMode: boolean = false;
    public currentCoPaymentFrecuency: CoPaymentFrecuency;

    constructor(private service: CoPaymentFrecService, private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private configuration: Config, private parameterService: ParameterService) {
        this.currentCoPaymentFrecuency = new CoPaymentFrecuency();
    }

    public edit(coPaymentFrecuency: CoPaymentFrecuency): void {
        this.currentCoPaymentFrecuency = coPaymentFrecuency;
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(coPaymentFrecuency: CoPaymentFrecuency): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.currentCoPaymentFrecuency = new CoPaymentFrecuency();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }


    public save(): void {
        if (!this.inEditMode) {
            this.saveNewCoPaymentFrecuency();
        } else {
            this.updateCoPaymentFrecuency();
        }
    }

    private saveNewCoPaymentFrecuency(): void {
        this.service.create(this.currentCoPaymentFrecuency)
            .subscribe((res) => {
                if (res.success) {
                    this.coPaymentsFrecuency.push(res.result);
                    this.currentCoPaymentFrecuency = new CoPaymentFrecuency();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadcoPaymentsFrecuency();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updateCoPaymentFrecuency(): void {
        this.service.update(this.currentCoPaymentFrecuency)
            .subscribe((res) => {
                if (res.success) {
                    this.currentCoPaymentFrecuency = new CoPaymentFrecuency();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadcoPaymentsFrecuency();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            })
    }

    private loadcoPaymentsFrecuency(): void {
        this.coPaymentsFrecuency = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.coPaymentsFrecuency = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/CoPaymentFrecuency/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/CoPaymentFrecuency/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/CoPaymentFrecuency/Edit");
        this.loadcoPaymentsFrecuency();
    }
}
