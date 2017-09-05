import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService, AlertService } from '../../services/index';
import { Config } from "../../config/config";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HomeService } from "../../services/homeService.service";
import { HomeReport } from "../../models/homeReport";
import { PatientReportData } from "../../models/patientReportData"
import { ProfessionalCopaymentReport } from "../../models/professionalCopaymentReport"

declare var $: any
@Component({
    selector: 'home',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {

    public homeReport: HomeReport;
    public barChartNursingLabels: string[] = ["Enfermería"];
    public barChartTherapyLabels: string[] = ["Terapias"];;
    public barChartNursingData: any[] = [{ data: [], label: "" }, { data: [], label: "" }, { data: [], label: "" }];
    public barChartTherapyData: any[] = [{ data: [], label: "" }, { data: [], label: "" }, { data: [], label: "" }];

    constructor(private homeService: HomeService, private alertService: AlertService) {
        this.homeReport = new HomeReport();        
    }
    ngOnInit(): void {
        this.homeService.getReport()
            .subscribe((res) => {
                if (res.success) {
                    this.homeReport = res.result;
                    this.populateData();
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });
    }
    public populateData(): void {
        let nursingClone = JSON.parse(JSON.stringify(this.barChartNursingData));

        for (var i = 0; i < this.homeReport.nursingStatuses.length; i++) {

            var element = this.homeReport.nursingStatuses[i];
            let dataItems = [element.amount];
            let serie = { data: [element.amount], label: element.name }
            nursingClone[i] = serie;
        }
        this.barChartNursingData = nursingClone;

        let therapyClone = JSON.parse(JSON.stringify(this.barChartTherapyData));

        for (var i = 0; i < this.homeReport.therapyStatuses.length; i++) {

            var element = this.homeReport.therapyStatuses[i];
            let serie = { data: [element.amount], label: element.name }
            therapyClone[i] = serie;
        }
        this.barChartTherapyData = therapyClone;
    }
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartType: string = 'bar';
    public barChartLegend: boolean = false;
}