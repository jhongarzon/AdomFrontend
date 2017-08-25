import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AssignServiceSupply } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AssignServiceSupplyService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'assignServiceSupply', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getByAssignServiceId(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'assignServiceSupply/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(assignServiceSupply: AssignServiceSupply) {
        return this.http.post(this.configuration.get("apiUrl") + 'assignServiceSupply', JSON.stringify(assignServiceSupply), this.authenticationService.jwt()).map((response: Response) => response.json());
    }   

    delete(id: number, assignServiceSupply: AssignServiceSupply) {
        return this.http.put(this.configuration.get("apiUrl") + 'assignServiceSupply/' + id, JSON.stringify(assignServiceSupply), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}