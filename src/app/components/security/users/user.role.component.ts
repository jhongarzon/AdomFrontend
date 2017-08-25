import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserRoleService } from '../../../services/user.role.service';
import { RoleService } from '../../../services/role.service';
import { UserRole } from '../../../models/user.role';
import { User } from '../../../models/user';
import { Config } from "../../../config/config";
import { AlertService } from '../../../services/alert.service';
import {  AuthenticationService } from '../../../services/authentication.service';

@Component({
    selector: 'userrole',
    templateUrl: 'user.role.component.html'
})

export class UserRoleComponent implements OnInit {
    public users: User[] = [];
    public userRoles: UserRole[] = [];
    public currentUser: User;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public inUserSelected: boolean = false;
    public rowsRecords: number;

    constructor(private serviceUser: UserService, 
                private serviceRole: RoleService, 
                private serviceUserRole: UserRoleService,
                private configuration: Config,
                private alertService: AlertService,
                private authenticationService: AuthenticationService) {  
                    
                }

    private loadUsers(): void {
        this.users = [];
        this.serviceUser.getAllWithoutPaginationActive()
            .subscribe((res) => {
                if (res.success) {
                    this.users = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors[0]);
                }
            });
    }

    public setOrUnsetUserRole(userRole: UserRole): void {
        this.serviceUserRole.createUserRole(userRole)
            .subscribe((res) => {
                if (!res.success) {
                    console.error(res.errors);
                    this.alertService.error(res.errors[0]);
                }
            });
    }

    public loadRolesByUserId(user: User): void {
        this.serviceUserRole.getRolesByUserId(user.userId)
            .subscribe((res) => {
                if (res.success) {
                    this.inUserSelected = true;
                    this.userRoles = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors[0]);
                }
            });
    }

    public onRowSelectUser(user: any): void {
        this.serviceUserRole.getRolesByUserId(user.data.userId)
            .subscribe((res) => {
                if (res.success) {
                    this.inUserSelected = true;
                    this.userRoles = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors[0]);
                }
            });
    }

    public ngOnInit() {
        this.rowsRecords = this.configuration.get("pageSize");
        this.authenticationService.isAuthorize("/UserRoles/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/UserRoles/Create");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/UserRoles/Edit");
        this.loadUsers();
    }
}