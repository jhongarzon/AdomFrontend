import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { CoPaymentFrecuency } from '../models/index';
import { AuthenticationService } from './authentication.service';
  
@Injectable()
export class CoPaymentFrecService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'coPaymentFrecuency?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'coPaymentFrecuency', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'coPaymentFrecuency/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(coPaymentFrecuency: CoPaymentFrecuency) {
        return this.http.post(this.configuration.get("apiUrl") + 'coPaymentFrecuency', JSON.stringify(coPaymentFrecuency), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(coPaymentFrecuency: CoPaymentFrecuency) {
        return this.http.put(this.configuration.get("apiUrl") + 'coPaymentFrecuency/' + coPaymentFrecuency.coPaymentFrecuencyId, JSON.stringify(coPaymentFrecuency), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}  