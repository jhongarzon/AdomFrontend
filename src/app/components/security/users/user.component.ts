import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { AlertService } from '../../../services/alert.service';
import {  AuthenticationService } from '../../../services/authentication.service';
import { Config } from "../../../config/config";

@Component({
    selector: 'users',
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {
    public users: User[] = [];
    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public onCreatePermission : boolean = false;
    public onEditPermission : boolean = false;
    public inCreateMode: boolean = false;
    public currentUser: User;
    public rowsRecords: number;

    constructor(private service: UserService, private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private configuration: Config) {
        this.currentUser = new User();
    }

    public edit(user: User): void {
        this.currentUser = user;
        this.inEditMode = true;
        this.inReadMode = false;
        this.inCreateMode = false;
    }

    public create(user: User): void {
        this.inEditMode = false;
        this.inReadMode = false;
        this.inCreateMode = true;
    }

    public cancel(): void {
        this.loadUsers();
        this.currentUser = new User();
        this.inEditMode = false;
        this.inReadMode = true;
        this.inCreateMode = false;
        this.alertService.clean(null);
    }


    public save(): void {
        if (!this.inEditMode) {
            this.saveNewUser();
        } else {
            this.updateUser();
        }
    }

    private saveNewUser(): void {
        this.service.create(this.currentUser)
            .subscribe((res) => {
                if (res.success) {
                    this.users.push(res.result);
                    this.currentUser = new User();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadUsers();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    private updateUser(): void {
        this.service.update(this.currentUser)
            .subscribe((res) => {
                if (res.success) {
                    this.currentUser = new User();
                    this.inEditMode = false;
                    this.inReadMode = true;
                    this.inCreateMode = false;
                    this.loadUsers();
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            })
    }

    private loadUsers(): void {
        this.users = [];
        this.service.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.users = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.rowsRecords = this.configuration.get("pageSize");
        this.authenticationService.isAuthorize("/Users/Get");
        this.onCreatePermission = this.authenticationService.hasPermissionResourceAction("/Users/Create");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/Users/Edit");
        this.loadUsers();
    }
}
