import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { PlanEntity } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class PlanEntityService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }
                           
    getByEntityId(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'planEntity/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(planEntity: PlanEntity) {
        return this.http.post(this.configuration.get("apiUrl") + 'planEntity', JSON.stringify(planEntity), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(planEntity: PlanEntity) {
        return this.http.put(this.configuration.get("apiUrl") + 'planEntity/' + planEntity.planEntityId, JSON.stringify(planEntity), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}