import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AuthenticationService } from './authentication.service';
import { Copayment } from '../models/copayment';

@Injectable()
export class CopaymentService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getCopayments(professionalId: number, serviceStatus: number, copaymentStatus: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'Copayment/' + professionalId + '/' + serviceStatus + '/' + copaymentStatus, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
    markAsDelivered(copayment: Copayment) {
        return this.http.put(this.configuration.get("apiUrl") + 'Copayment/' + copayment.assignServiceId, JSON.stringify(copayment), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}