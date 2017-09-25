import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { EntityService } from '../../services/entity.service';
import { ServiceService } from '../../services/service.service';
import { PlanEntityService } from '../../services/planEntity.service';
import { PaymentReportService } from '../../services/paymentReport.service';
import { PaymentReportFilter } from '../../models/paymentReportFilter';
import { Entity } from '../../models/entity';
import { Service } from '../../models/service';
import { PlanEntity } from '../../models/planEntity';
import * as FileSaver from 'file-saver';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

@Component({
    selector: 'paymentReport',
    templateUrl: 'paymentReport.component.html'
})
export class PaymentReportComponent implements OnInit {
    public hasCreatePermission: boolean = false;
    public paymentReportFilter: PaymentReportFilter;
    public entityList: Entity[] = [];
    public serviceList: Service[] = [];
    public planEntityList: PlanEntity[] = [];
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };

    constructor(
        private authenticationService: AuthenticationService,
        private paymentReportService: PaymentReportService,
        private alertService: AlertService,
        private entityService: EntityService,
        private serviceService: ServiceService,
        private planEntityService: PlanEntityService, ) {
        this.paymentReportFilter = new PaymentReportFilter();

    }

    ngOnInit(): void {
        this.authenticationService.isAuthorize("/PaymentReport/Create");
        this.hasCreatePermission = this.authenticationService.hasPermissionResourceAction("/PaymentReport/Create");
        this.entityService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.entityList = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
        this.serviceService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.serviceList = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
        this.loadPlans(this.paymentReportFilter.entityId);

    }
    private loadPlans(entityId: number): void {
        this.paymentReportFilter.planEntityId = -1;
        this.planEntityService.getByEntityId(entityId)
            .subscribe((res) => {
                if (res.success) {
                    this.planEntityList = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }
    public generateReport(): void {
        if (this.paymentReportFilter.initialDateIni != null && this.paymentReportFilter.initialDateEnd == null) {
            this.alertService.error("Debe completar el rango para la fecha de atención");
            return;
        }
        if (this.paymentReportFilter.initialDateEnd != null && this.paymentReportFilter.initialDateIni == null) {
            this.alertService.error("Debe completar el rango para la fecha de atención");
            return;
        }
        this.paymentReportService.getPaymentReport(this.paymentReportFilter)
            .subscribe((res) => {
                if (res) {
                    FileSaver.saveAs(res, "PaymentReport.xlsx");
                } else {
                    this.alertService.error("No se ha recibido respuesta del servidor");
                }
            });
    }
    onInitialDateIniChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.paymentReportFilter.initialDateIni = null;
        } else {
            this.paymentReportFilter.initialDateIni = event.formatted;
        }        
    }
    onInitialDateEndChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.paymentReportFilter.initialDateEnd = null;
        } else {
            this.paymentReportFilter.initialDateEnd = event.formatted;
        }
    }
}