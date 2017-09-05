import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { LockService } from '../../models/lockService';
import { LockServicesService } from '../../services/lockServices.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'lockServices',
    templateUrl: 'lockServices.component.html'
})

export class LockServicesComponent implements OnInit {
    public onEditPermission: boolean = false;
    public lockService: LockService;

    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };
    constructor(private alertService: AlertService,
        private lockServicesService: LockServicesService,
        private authenticationService: AuthenticationService,
        private configuration: Config) {
        this.lockService = new LockService();

        let currentDate = new Date();
        let today = {
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                day: currentDate.getDate()
            }
        };
        this.lockService.lockDateObj = today;
        let datePipe = new DatePipe("es-CO");
        this.lockService.lockDate = datePipe.transform(currentDate, 'dd/MM/yyyy');
    }
    public onLockDateChanged(event: IMyDateModel) {
        this.lockService.lockDate = event.formatted;
    }
    public updateLockDate(): void {
        this.lockServicesService.update(this.lockService)
            .subscribe((res) => {
                if (res) {
                    this.alertService.error("Fecha de bloqueo actualizada correctamente");
                } else {
                    this.alertService.error("No se ha recibido respuesta del servidor");
                }
            });
    }

    public ngOnInit() {
        this.authenticationService.isAuthorize("/LockServices/Edit");
        this.onEditPermission = this.authenticationService.hasPermissionResourceAction("/LockServices/Edit");
    }
}