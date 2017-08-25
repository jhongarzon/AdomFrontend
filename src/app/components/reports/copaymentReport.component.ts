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
        debugger;
        this.copaymentReportService.getCopaymentReport(this.copaymentReportFilter)
            .subscribe((res) => {
                if (res) {
                    debugger;
                    FileSaver.saveAs(res, "CopaymentReport.xlsx");
                } else {
                    this.alertService.error("No se ha recibido respuesta del servidor");
                }
            });
    }
   
    onInitialDateChanged(event: IMyDateModel) {
        this.copaymentReportFilter.initialDate = event.formatted;
    }
    onFinalDateChanged(event: IMyDateModel) {
        this.copaymentReportFilter.finalDate = event.formatted;
    }
    onDeliverDateChanged(event: IMyDateModel) {
        this.copaymentReportFilter.deliverDate = event.formatted;
    }
}