import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AssignService } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AssignServiceService {


    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'assignService', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getByPatientId(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'assignService/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    calculateFinalDateAssignService(quantity: number, serviceFrecuencyId: number, initialDate: string) {
        let iniDate = initialDate.replace("/", "-").replace("/", "-");
        return this.http.get(this.configuration.get("apiUrl") + 'assignService/' + quantity + "/" + serviceFrecuencyId + "/" + iniDate, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(assignService: AssignService) {
        return this.http.post(this.configuration.get("apiUrl") + 'assignService', JSON.stringify(assignService), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(assignService: AssignService) {
        return this.http.put(this.configuration.get("apiUrl") + 'assignService/' + assignService.assignServiceId, JSON.stringify(assignService), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}