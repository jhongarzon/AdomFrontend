import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Supply } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class SupplyService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'supply?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'supply', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'supply/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(supply: Supply) {
        return this.http.post(this.configuration.get("apiUrl") + 'supply', JSON.stringify(supply), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(supply: Supply) {
        return this.http.put(this.configuration.get("apiUrl") + 'supply/' + supply.supplyId, JSON.stringify(supply), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}