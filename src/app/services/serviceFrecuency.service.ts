import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { ServiceFrecuency } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ServiceFrecuencyService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'serviceFrecuency?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'serviceFrecuency', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'serviceFrecuency/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(serviceFrecuency: ServiceFrecuency) {
        return this.http.post(this.configuration.get("apiUrl") + 'serviceFrecuency', JSON.stringify(serviceFrecuency), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(serviceFrecuency: ServiceFrecuency) {
        return this.http.put(this.configuration.get("apiUrl") + 'serviceFrecuency/' + serviceFrecuency.serviceFrecuencyId, JSON.stringify(serviceFrecuency), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}