import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { EntityService } from '../../services/entity.service';
import { ServiceService } from '../../services/service.service';
import { PlanEntityService } from '../../services/planEntity.service';
import { SpecialReportService } from '../../services/specialReport.service';
import { SpecialReportFilter } from '../../models/specialReportFilter';
import { Entity } from '../../models/entity';
import { Service } from '../../models/service';
import { PlanEntity } from '../../models/planEntity';
import * as FileSaver from 'file-saver';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { SelectItem } from '../../models/selectItem';


@Component({
    selector: 'specialReport',
    templateUrl: 'specialReport.component.html'
})
export class SpecialReportComponent implements OnInit {
    public hasCreatePermission: boolean = false;
    public specialReportFilter: SpecialReportFilter;
    public entityList: Entity[] = [];
    public serviceList: Service[] = [];
    public planEntityList: PlanEntity[] = [];
    public patientTypeList: SelectItem[] = [];
    public reportTypeList: SelectItem[] = [];
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };

    constructor(
        private authenticationService: AuthenticationService,
        private specialReportService: SpecialReportService,
        private alertService: AlertService,
        private entityService: EntityService,
        private serviceService: ServiceService,
        private planEntityService: PlanEntityService, ) {
        this.specialReportFilter = new SpecialReportFilter();
        this.specialReportFilter.reportType = 1;
        this.patientTypeList = this.loadPatientTypes();
        this.reportTypeList = this.loadReportTypes();

    }
    public loadPatientTypes(): any {
        let items: SelectItem[] = [];

        let chronic = new SelectItem();
        chronic.value = "1";
        chronic.label = "Crónico";

        let acute = new SelectItem();
        acute.value = "2";
        acute.label = "Agudo";

        items[0] = chronic;
        items[1] = acute;
        return items;
    }
    public loadReportTypes(): any {
        let items: SelectItem[] = [];

        let consolidated = new SelectItem();
        consolidated.value = "1";
        consolidated.label = "Consolidado";

        let detailed = new SelectItem();
        detailed.value = "2";
        detailed.label = "Detallado";

        items[0] = consolidated;
        items[1] = detailed;
        return items;
    }
    ngOnInit(): void {
        this.authenticationService.isAuthorize("/SpecialReport/Create");
        this.hasCreatePermission = this.authenticationService.hasPermissionResourceAction("/SpecialReport/Create");
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
        this.loadPlans(this.specialReportFilter.entityId);

    }
    private loadPlans(entityId: number): void {
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
        if (this.specialReportFilter.initialDateIni != null && this.specialReportFilter.initialDateEnd == null) {
            this.alertService.error("Debe completar el rango para la fecha inicial");
            return;
        }
        if (this.specialReportFilter.initialDateEnd != null && this.specialReportFilter.initialDateIni == null) {
            this.alertService.error("Debe completar el rango para la fecha inicial");
            return;
        }
        if (this.specialReportFilter.requestDateIni != null && this.specialReportFilter.requestDateEnd == null) {
            this.alertService.error("Debe completar el rango para la fecha de solicitud");
            return;
        }
        if (this.specialReportFilter.requestDateEnd != null && this.specialReportFilter.requestDateIni == null) {
            this.alertService.error("Debe completar el rango para la fecha de solicitud");
            return;
        }
        if (this.specialReportFilter.visitDateIni != null && this.specialReportFilter.visitDateEnd == null) {
            this.alertService.error("Debe completar el rango para la fecha de solicitud");
            return;
        }
        if (this.specialReportFilter.visitDateEnd != null && this.specialReportFilter.visitDateIni == null) {
            this.alertService.error("Debe completar el rango para la fecha de visita");
            return;
        }

        this.specialReportService.getSpecialReport(this.specialReportFilter)
            .subscribe((res) => {
                if (res) {
                    FileSaver.saveAs(res, "SpecialReport.xlsx");
                } else {
                    this.alertService.error("No se ha recibido respuesta del servidor");
                }
            });
    }
    onInitialDateIniChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.specialReportFilter.initialDateIni = null;
        } else {
            this.specialReportFilter.initialDateIni = event.formatted;
        }
    }
    onRequestDateIniChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.specialReportFilter.requestDateIni = null;
        } else {
            this.specialReportFilter.requestDateIni = event.formatted;
        }
    }
    onVisitDateIniChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.specialReportFilter.visitDateIni = null;
        } else {
            this.specialReportFilter.visitDateIni = event.formatted;
        }
    }
    onInitialDateEndChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.specialReportFilter.initialDateEnd = null;
        } else {
            this.specialReportFilter.initialDateEnd = event.formatted;
        }
    }
    onRequestDateEndChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.specialReportFilter.requestDateEnd = null;
        } else {
            this.specialReportFilter.requestDateEnd = event.formatted;
        }
    }
    onVisitDateEndChanged(event: IMyDateModel) {
        if (event.formatted == "") {
            this.specialReportFilter.visitDateEnd = null;
        } else {
            this.specialReportFilter.visitDateEnd = event.formatted;
        }
    }
}