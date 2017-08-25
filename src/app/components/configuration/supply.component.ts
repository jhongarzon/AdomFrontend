import { Component, OnInit } from '@angular/core';
import { SupplyService } from '../../services/supply.service';
import { ParameterService } from '../../services/parameter.service';
import { Supply } from '../../models/supply';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import {  AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";

@Component({
    selector: 'supply',
    templateUrl: 'supply.component.html'
})

export class SupplyComponent implements OnInit {
    public supplies: Supply[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public inCreateMode: boolean = false;
    public currentSupply: Supply;

    constructor(private service: SupplyService, private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private configuration: Config, private parameterService: ParameterService) {
        this.currentSupply = new Supply();
    }

    public edit(Supply: Supply): void {
        this.currentSupply = Supply;
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(Supply: Supply): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.currentSupply = new Supply();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }


    public save(): void {
        if (!this.inEditMode) {
            this.saveNewSupply();
        } else {
            this.updateSupply();
        }
    }

    private saveNewSupply(): void {
        this.service.create(this.currentSupply)
            .subscribe((res) => {
                if (res.success) {
                    this.supplies.push(res.result);
                    this.currentSupply = new Supply();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadSupplies();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updateSupply(): void {
        this.service.update(this.currentSupply)
            .subscribe((res) => {
                if (res.success) {
                    this.currentSupply = new Supply();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadSupplies();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            })
    }

    private loadSupplies(): void {
        this.supplies = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.supplies = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/Supply/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Supply/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Supply/Edit");
        this.loadSupplies();
    }
}
