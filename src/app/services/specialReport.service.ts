import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AuthenticationService } from './authentication.service';
import { Copayment } from '../models/copayment';
import { SpecialReportFilter } from '../models/specialReportFilter';
import { RipsGenerationData } from "app/models/ripsGenerationData";

@Injectable()
export class SpecialReportService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getSpecialReport(specialReportFilter: SpecialReportFilter) {
        debugger;
        return this.http.post(this.configuration.get("apiUrl") + 'SpecialReport', JSON.stringify(specialReportFilter), this.authenticationService.jwtDownloadZip())
            .map((response: Response) => {
                return new Blob([response.blob()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            });
    }
}