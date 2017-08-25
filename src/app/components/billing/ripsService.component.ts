import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import { SelectItem } from '../../models/selectItem';
import { EntityService } from '../../services/entity.service';
import { PlanEntityService } from '../../services/planEntity.service';
import { Entity } from '../../models/entity';
import { Rips } from '../../models/rips';
import { PlanEntity } from '../../models/planEntity';
import { RipsFilter } from '../../models/ripsFilter';
import { RipsService } from '../../services/rips.service';
import { RipsGenerationData } from "app/models/ripsGenerationData";
import * as FileSaver from 'file-saver';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';

@Component({
    selector: 'ripsService',
    templateUrl: 'ripsService.component.html'
})

export class RipsServiceComponent implements OnInit {
    private myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy', editableDateField: false, openSelectorOnInputClick: true
    };



    public inEditMode: boolean = false;
    public inReadMode: boolean = true;
    public userId: number;
    public hasSearchPermission: boolean = false;
    public hasCreatePermission: boolean = false;
    public entityList: Entity[] = [];
    public serviceTypes: SelectItem[] = [];
    public planEntityList: PlanEntity[] = [];
    public ripsFilter: RipsFilter;
    public rips: Rips[] = [];
    public selectedRips: Rips[];

    constructor(private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private configuration: Config,
        private entityService: EntityService,
        private planEntityService: PlanEntityService,
        private ripsService: RipsService) {
        this.ripsFilter = new RipsFilter();
        let currentDate = new Date();
        let day = currentDate.getDate().toString();
        let month = (currentDate.getMonth() + 1).toString();
        let initialMonth = currentDate.getMonth().toString();
        let year = currentDate.getFullYear().toString();
        if (day.length == 1) {
            day = "0" + day;
        }
        if (month.length == 1) {
            month = "0" + month;
        }
        if (initialMonth.length == 1) {
            initialMonth = "0" + initialMonth;
        }
        let formattedDate = day + "-" + month + "-" + year;
        let formattedInitialDate = day + "-" + initialMonth + "-" + year;
        let today = {
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                day: currentDate.getDate()
            }
        };
        let oneMonthBefore = {
            date: {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
                day: currentDate.getDate()
            }
        };
        this.ripsFilter.initialDate = formattedInitialDate;
        this.ripsFilter.invoiceDate = formattedDate;
        this.ripsFilter.finalDate = formattedDate;
        this.ripsFilter.invoiceDateObj = today;
        this.ripsFilter.initialDateObj = oneMonthBefore;
        this.ripsFilter.finalDateObj = today;


    }
    ngOnInit(): void {
        this.authenticationService.isAuthorize("/Rips/Get");
        this.authenticationService.isAuthorize("/Rips/Create");
        this.hasSearchPermission = this.authenticationService.hasPermissionResourceAction("/Rips/Get");
        this.hasCreatePermission = this.authenticationService.hasPermissionResourceAction("/Rips/Create");
        this.loadEntities();
        this.serviceTypes = this.loadServiceTypeStatuses();
    }

    public loadServiceTypeStatuses(): any {
        let items: SelectItem[] = [];

        let nursing = new SelectItem();
        nursing.value = "2";
        nursing.label = "Enfermería";

        let therapy = new SelectItem();
        therapy.value = "3";
        therapy.label = "Terapia";

        items[0] = nursing;
        items[1] = therapy;
        return items;
    }
    public loadEntities() {
        this.entityService.getAllWithoutPagination()
            .subscribe((res) => {
                if (res.success) {
                    this.entityList = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }
    public loadPlansEntity(entityId: number) {
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

    public entityChanged(entityId: number): void {
        this.loadPlansEntity(entityId);
    }
    public loadRips(): void {
        this.ripsService.getRips(
            (this.ripsFilter.entityId == null) ? 0 : this.ripsFilter.entityId,
            (this.ripsFilter.planEntityId == null) ? 0 : this.ripsFilter.planEntityId,
            (this.ripsFilter.serviceTypeId == null) ? 0 : this.ripsFilter.serviceTypeId,
            (this.ripsFilter.initialDate == null) ? "" : this.ripsFilter.initialDate,
            (this.ripsFilter.finalDate == null) ? "" : this.ripsFilter.finalDate)
            .subscribe((res) => {
                if (res.success) {
                    this.selectedRips = null;
                    this.rips = res.result;
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }

    public generateRips(): void {
        debugger;
        if (this.selectedRips == null) {
            this.alertService.error("Seleccione por lo menos un registro");
            return;
        }
        if (this.selectedRips.length < 1) {
            this.alertService.error("Seleccione por lo menos un registro");
            return;
        }
        if (this.ripsFilter.invoiceNumber == null) {
            this.alertService.error("Ingrese un número de factura");
            return;
        }
        if (this.ripsFilter.invoiceNumber < 1) {
            this.alertService.error("Ingrese un número de factura");
            return;
        }
        if (this.ripsFilter.invoiceDate == null) {
            this.alertService.error("Ingrese una fecha de factura");
            return;
        }
        if (this.ripsFilter.invoiceDate == "") {
            this.alertService.error("Ingrese una fecha de factura");
            return;
        }
        if (this.ripsFilter.copayment == null) {
            this.alertService.error("Ingrese un valor para el copago");
            return;
        }
        if (this.ripsFilter.copayment < 1) {
            this.alertService.error("Ingrese un valor para el copago");
            return;
        }
        if (this.ripsFilter.netValue == null) {
            this.alertService.error("Ingrese un valor para el valor neto");
            return;
        }
        if (this.ripsFilter.netValue < 1) {
            this.alertService.error("Ingrese un valor para el valor neto");
            return;
        }
        let invoiceError = false;
        this.selectedRips.forEach(element => {
            if (element.invoiceNumber != null && element.invoiceNumber != "") {
                this.alertService.error("El numero de autorización " + element.authorizationNumber + " tiene asignado el número de factura " + element.invoiceNumber);
                invoiceError = true;
                return;
            }
        });
        if (invoiceError) return;
        let ripsGenerationData = new RipsGenerationData();
        ripsGenerationData.rips = this.selectedRips;
        ripsGenerationData.ripsFilter = this.ripsFilter;
        this.ripsService.generateRips(ripsGenerationData)
            .subscribe((res) => {
                if (res) {
                    debugger;
                    FileSaver.saveAs(res, "Rips.zip");
                    this.loadRips();
                } else {
                    this.alertService.error("No se ha recibido respuesta del servidor");
                }
            });
    }
    onInitialDateChanged(event: IMyDateModel) {
        this.ripsFilter.initialDate = event.formatted;
    }
    onFinalDateChanged(event: IMyDateModel) {
        this.ripsFilter.finalDate = event.formatted;
    }
    onInvoiceDateChanged(event: IMyDateModel) {
        this.ripsFilter.invoiceDate = event.formatted;
    }
}