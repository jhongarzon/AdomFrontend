import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RoleActionResourceService } from '../../../services/role.action.resource.service';
import { RoleService } from '../../../services/role.service';
import { RoleActionResource } from '../../../models/role.action.resource';
import { Role } from '../../../models/role';
import { Config } from "../../../config/config";
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
declare var $: any
@Component({
    selector: 'roleactionresource',
    templateUrl: 'role.action.resource.component.html'
})

export class RoleActionResourceComponent implements OnInit, AfterViewInit {
    public roles: Role[] = [];
    public roleActionResource: RoleActionResource[] = [];
    public currentRole: Role;
    public inRoleSelected: boolean = false;

    constructor(private serviceRole: RoleService,
        private serviceRoleActionResource: RoleActionResourceService,
        private alertService: AlertService,
        private configuration: Config,
        private authenticationService: AuthenticationService) {
    }

    private loadRoles(): void {
        this.roles = [];
        this.serviceRole.getAll(1, 100)
            .subscribe((res) => {
                if (res.success) {
                    this.roles = res.result;
                } else {
                    this.alertService.error(res.errors[0]);
                    console.error(res.errors);
                }
            });
    }

    public setOrUnsetRoleActionResource(roleActionResource: RoleActionResource): void {
        this.serviceRoleActionResource.createRoleActionResource(roleActionResource)
            .subscribe((res) => {
                if (!res.success) {
                    this.alertService.error(res.errors[0]);
                    console.error(res.errors);
                }
            });
    }

    public loadActionResourceByRoleId(role: Role): void {
        this.serviceRoleActionResource.getActionsResourcesByRoleId(role.roleId)
            .subscribe((res) => {
                if (res.success) {
                    this.inRoleSelected = true;
                    this.roleActionResource = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors[0]);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/RoleActionsResources/Get");
        this.loadRoles();
    }
    public ngAfterViewInit() {
        $('select').material_select();
    }
}