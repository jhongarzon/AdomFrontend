import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { PlanRate } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class PlanRateService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getByEntityId(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'planRate/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(planRate: PlanRate) {
        return this.http.post(this.configuration.get("apiUrl") + 'planRate', JSON.stringify(planRate), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    delete(planRate: PlanRate) {
        return this.http.put(this.configuration.get("apiUrl") + 'planRate/' + planRate.planRateId, JSON.stringify(planRate), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}