import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../models/role';
import { AlertService } from '../../../services/alert.service';
import {  AuthenticationService } from '../../../services/authentication.service';
import {  LazyLoadEvent } from '../../../interfaces/lazyLoadEvent.interface';
import { Config } from "../../../config/config";

@Component({
    selector: 'roles',
    templateUrl: 'role.component.html'
})

export class RoleComponent implements OnInit {
    public roles: Role[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public inCreateMode: boolean = false;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public currentRole: Role;
    public totalRecords: number;
    public rowsRecords: number;

    constructor(private service: RoleService, private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private configuration: Config) {
        this.currentRole = new Role();
    }

    public edit(role: Role): void {
        this.currentRole = role;
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(role: Role): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.loadRoles(1);
        this.currentRole = new Role();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
    }


    public save(): void {
        if (!this.inEditMode) {
            this.saveNewRole();
        } else {
            this.updateRole();
        }
    }

    private saveNewRole(): void {
        this.service.create(this.currentRole)
            .subscribe((res) => {
                if (res.success) {
                    this.roles.push(res.result);
                    this.currentRole = new Role();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadRoles(1);
                }
                else {
                    this.alertService.error(res.errors[0]);
                    console.error(res.errors);
                }
            });
    }

    private updateRole(): void {
        this.service.update(this.currentRole)
            .subscribe((res) => {
                if (res.success) {
                    this.currentRole = new Role();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadRoles(1);
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors[0]);
                }
            })
    }

    private loadRoles(page:number): void {
        this.roles = [];
        this.service.getAll(page, 50)
            .subscribe((res) => {   
                if (res.success) {
                    this.roles = res.result;
                    
                    if(this.roles != null && this.roles.length > 0){
                        this.totalRecords = this.roles[0].totalRows;
                    }
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors[0]);
                }
            });
    }

    public ngOnInit() {
        this.rowsRecords = this.configuration.get("pageSize");
        this.authenticationService.isAuthorize("/Roles/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Roles/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Roles/Edit");
        this.roles = [];
        this.loadRoles(1); 
    }
} 