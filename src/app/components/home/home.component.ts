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
    public months: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    public barChartNursingLabels: string[] = ["", "", "", "", "", ""];
    public barChartTherapyLabels: string[] = ["", "", "", "", "", ""];;
    public barChartNursingData: any[] = [{ data: [], label: "PROGRAMADAS" }, { data: [], label: "COMPLETADAS" }, { data: [], label: "CANCELADAS" }];
    public barChartTherapyData: any[] = [{ data: [], label: "PROGRAMADAS" }, { data: [], label: "COMPLETADAS" }, { data: [], label: "CANCELADAS" }];

    constructor(private homeService: HomeService, private alertService: AlertService,
        private route: ActivatedRoute, private router: Router, ) {

        this.homeReport = new HomeReport();
        let date = new Date();
        let month = date.getMonth() + 1;
        for (var i = 0; i < 6; i++) {
            month = month - 1;
            date.setMonth(month);
            this.barChartNursingLabels[i] = this.months[date.getMonth()];
            this.barChartTherapyLabels[i] = this.months[date.getMonth()];
        }
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
    gotoService(patientReportData: PatientReportData) {
        
        location.href = "/assignservice?patientId=" + patientReportData.patientId + "&assignServiceId=" + patientReportData.assignServiceId;
        //this.router.navigate(['/assignservice', { patientId: patientReportData.patientId, assignServiceId: patientReportData.assignServiceId }]);
    }
    public populateData(): void {
        let nursingClone = JSON.parse(JSON.stringify(this.barChartNursingData));
        let nursingProgrammedData = [];
        let nursingCompletedData = [];
        let nursingCanceledData = [];
        for (var i = 0; i < this.homeReport.nursingStatuses.length; i++) {

            var element = this.homeReport.nursingStatuses[i];
            if (element.status == "1") {
                nursingProgrammedData.push(element.amount);

            } else if (element.status == "2") {
                nursingCompletedData.push(element.amount);

            } else if (element.status == "3") {
                nursingCanceledData.push(element.amount);
            }
        }
        nursingClone[0] = { data: nursingProgrammedData, label: "PROGRAMADAS" };
        nursingClone[1] = { data: nursingCompletedData, label: "COMPLETADAS" };
        nursingClone[2] = { data: nursingCanceledData, label: "CANCELADAS" };
        this.barChartNursingData = nursingClone;

        let therapyClone = JSON.parse(JSON.stringify(this.barChartTherapyData));

        let therapyProgrammedData = [];
        let therapyCompletedData = [];
        let therapyCanceledData = [];

        for (var i = 0; i < this.homeReport.therapyStatuses.length; i++) {

            var element = this.homeReport.therapyStatuses[i];

            if (element.status == "1") {
                therapyProgrammedData.push(element.amount);
            } else if (element.status == "2") {
                therapyCompletedData.push(element.amount);
            } else if (element.status == "3") {
                therapyCanceledData.push(element.amount);
            }
        }
        therapyClone[0] = { data: therapyProgrammedData, label: "PROGRAMADAS" };
        therapyClone[1] = { data: therapyCompletedData, label: "COMPLETADAS" };
        therapyClone[2] = { data: therapyCanceledData, label: "CANCELADAS" };
        this.barChartTherapyData = therapyClone;
    }
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
}