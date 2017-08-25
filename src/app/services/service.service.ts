import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Service } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ServiceService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'service?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'service', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'service/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getByPlanEntityId(planEntityId: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'service/' + planEntityId + "/1", this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(service: Service) {
        return this.http.post(this.configuration.get("apiUrl") + 'service', JSON.stringify(service), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(service: Service) {
        return this.http.put(this.configuration.get("apiUrl") + 'service/' + service.serviceId, JSON.stringify(service), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}