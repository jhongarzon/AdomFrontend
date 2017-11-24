import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Password } from '../../../models/password';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Config } from "../../../config/config";

@Component({
    selector: 'changePassword',
    templateUrl: 'changePassword.component.html'
})

export class ChangePasswordComponent implements OnInit {
    public currentPassword: Password;
    private loading: boolean;
    constructor(private service: UserService, private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private configuration: Config) {
        this.currentPassword = new Password();
    }

    public save(): void {
        if (this.currentPassword.password == this.currentPassword.confirmPassword) {
            this.changePassword();
        }
        else {
            this.alertService.error("La contraseña y la confirmación no coinciden.");
        }
    }

    private changePassword(): void {
        this.loading = true;
        this.service.ChangePassword(this.currentPassword)
            .subscribe((res) => {
                if (res.success) {
                    this.alertService.success("Contraseña guardada satisfactoriamente.");
                }
                else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/Users/ChangePassword");
    }
}
