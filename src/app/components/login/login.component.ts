import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../../services/index';
declare var $: any

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
})

export class LoginComponent implements OnInit, AfterViewInit {
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
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    ngAfterViewInit() {
        $('.parallax').parallax();
    }
    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
                this.dataResponse = data;
                if (!this.dataResponse.success) {
                    this.alertService.error(this.dataResponse.errors[0]);
                    this.loading = false;
                }
                else {
                    localStorage.setItem('currentUser', JSON.stringify(this.dataResponse.result));
                    window.location.href = '/notices';
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            );
    }


}
