import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../../services/index';
declare var $: any

@Component({
    selector: 'recoverPassword',
    templateUrl: 'recoverPassword.component.html',
})

export class RecoverPasswordComponent implements OnInit, AfterViewInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    dataResponse: any;

    constructor(
        private _http: Http,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.authenticationService.logout();
    }

    ngAfterViewInit() {
        $('.parallax').parallax();
        $('#outlet-container').css("padding-left", "0px");
        $('#outlet-container').css("height", "100%");
    }

    recover() {
        this.loading = true;
        this.authenticationService.recoverPassword(this.model.username)
            .subscribe(
            data => {
                this.dataResponse = data;
                if (!this.dataResponse.success) {
                    this.alertService.error(this.dataResponse.errors[0]);
                    this.loading = false;
                }
                else {
                    this.alertService.success("La contraseña ha sido enviada al correo electrónico.");
                    this.loading = false;
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            );
    }


}
