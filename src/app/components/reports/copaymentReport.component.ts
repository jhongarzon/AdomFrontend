import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfessionalService } from '../../services/professional.service';
import { CopaymentReportService } from '../../services/copaymentReport.service';
import { CopaymentReportFilter } from '../../models/copaymentReportFilter';
import { Professional } from '../../models/professional';
import * as FileSaver from 'file-saver';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';


@Component({
    selector: 'copaymentReport',
    templateUrl: 'copaymentReport.component.html'
})
export class CopaymentReportComponent implements OnInit {
    public hasCreatePermission: boolean = false;
    public copaymentReportFilter: CopaymentReportFilter;
    public professionalList: Professional[] = [];
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };

    constructor(
        private authenticationService: AuthenticationService,
        private copaymentReportService: CopaymentReportService,
        private alertService: AlertService,
        private professionalService: ProfessionalService) {

        this.copaymentReportFilter = new CopaymentReportFilter();
        

    }

    ngOnInit(): void {
        this.authenticationService.isAuthorize("/CopaymentReport/Create");
        this.hasCreatePermission = this.authenticationService.hasPermissionResourceAction("/CopaymentReport/Create");
        this.professionalService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.professionalList = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });

    }
    public generateReport(): void {
        if (this.copaymentReportFilter.initialDateIni != null && this.copaymentReportFilter.initialDateEnd == null) {
            this.alertService.error("Debe completar el rango para la fecha inicial");
            return;
        }
        if (this.copaymentReportFilter.initialDateEnd != null && this.copaymentReportFilter.initialDateIni == null) {
            this.alertService.error("Debe completar el rango para la fecha inicial");
            return;
        }
        if (this.copaymentReportFilter.finalDateIni != null && this.copaymentReportFilter.finalDateEnd == null) {
            this.alertService.error("Debe completar el rango para la fecha final");
            return;
        }
        if (this.copaymentReportFilter.finalDateEnd != null && this.copaymentReportFilter.finalDateIni == null) {
            this.alertService.error("Debe completar el rango para la fecha final");
            return;
        }
        if (this.copaymentReportFilter.deliverDateIni != null && this.copaymentReportFilter.deliverDateEnd == null) {
            this.alertService.error("Debe completar el rango para la fecha de entrega");
            return;
        }
        if (this.copaymentReportFilter.deliverDateEnd != null && this.copaymentReportFilter.deliverDateIni == null) {
            this.alertService.error("Debe completar el rango para la fecha de entrega");
            return;
        }
        this.copaymentReportService.getCopaymentReport(this.copaymentReportFilter)
            .subscribe((res) => {
                if (res) {
                    FileSaver.saveAs(res, "CopaymentReport.xlsx");
                } else {
                    this.alertService.error("No se ha recibido respuesta del servidor");
                }
            });
    }
   
    onInitialDateIniChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.copaymentReportFilter.initialDateIni = null;
        } else {
            this.copaymentReportFilter.initialDateIni = event.formatted;
        }
    }
    onFinalDateIniChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.copaymentReportFilter.finalDateIni = null;
        } else {
            this.copaymentReportFilter.finalDateIni = event.formatted;
        }
    }
    onDeliverDateIniChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.copaymentReportFilter.deliverDateIni = null;
        } else {
            this.copaymentReportFilter.deliverDateIni = event.formatted;
        }
    }
    onInitialDateEndChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.copaymentReportFilter.initialDateEnd = null;
        } else {
            this.copaymentReportFilter.initialDateEnd = event.formatted;
        }
    }
    onFinalDateEndChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.copaymentReportFilter.finalDateEnd = null;
        } else {
            this.copaymentReportFilter.finalDateEnd = event.formatted;
        }
    }
    onDeliverDateEndChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.copaymentReportFilter.deliverDateEnd = null;
        } else {
            this.copaymentReportFilter.deliverDateEnd = event.formatted;
        }
    }
}