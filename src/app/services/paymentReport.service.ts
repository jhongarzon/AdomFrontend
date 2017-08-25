import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AuthenticationService } from './authentication.service';
import { Copayment } from '../models/copayment';
import { PaymentReportFilter } from '../models/paymentReportFilter';
import { RipsGenerationData } from "app/models/ripsGenerationData";

@Injectable()
export class PaymentReportService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getPaymentReport(paymentReportFilter: PaymentReportFilter) {
        return this.http.post(this.configuration.get("apiUrl") + 'PaymentReport', JSON.stringify(paymentReportFilter), this.authenticationService.jwtDownloadZip())
        .map((response: Response) => {
            return new Blob([response.blob()], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        });
    }
}