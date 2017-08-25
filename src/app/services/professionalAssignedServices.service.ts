import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AssignService } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ProfessionalAssignedServicesService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getScheduledServices(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'ProfessionalAssignedServices/' + id + '/1', this.authenticationService.jwt()).map((response: Response) => response.json());
    }
    getCompletedServices(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'ProfessionalAssignedServices/' + id + '/2', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

}