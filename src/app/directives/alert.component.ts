import { Component, OnInit } from '@angular/core';

import { AlertService } from '../services/index';

@Component({
    selector: 'alertmessage',
    templateUrl: 'alert.component.html'
})

export class AlertMessageComponent {   
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}   