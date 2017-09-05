import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AuthenticationService } from './authentication.service';
import { Copayment } from '../models/copayment';
import { CopaymentReportFilter } from '../models/copaymentReportFilter';
import { RipsGenerationData } from "../../app/models/ripsGenerationData";

@Injectable()
export class CopaymentReportService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getCopaymentReport(copaymentReportFilter: CopaymentReportFilter) {
        return this.http.post(this.configuration.get("apiUrl") + 'CopaymentReport', JSON.stringify(copaymentReportFilter), this.authenticationService.jwtDownloadZip())
        .map((response: Response) => {
            return new Blob([response.blob()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        });
    }
}