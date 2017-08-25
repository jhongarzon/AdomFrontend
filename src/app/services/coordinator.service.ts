import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Coordinator } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class CoordinatorService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'coordinator?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'coordinator', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'coordinator/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(coordinator: Coordinator) {
        return this.http.post(this.configuration.get("apiUrl") + 'coordinator', JSON.stringify(coordinator), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(coordinator: Coordinator) {
        return this.http.put(this.configuration.get("apiUrl") + 'coordinator/' + coordinator.coordinatorId, JSON.stringify(coordinator), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}