import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Entity } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class EntityService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'entity?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'entity', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'entity/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(entity: Entity) {
        return this.http.post(this.configuration.get("apiUrl") + 'entity', JSON.stringify(entity), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(entity: Entity) {
        return this.http.put(this.configuration.get("apiUrl") + 'entity/' + entity.entityId, JSON.stringify(entity), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}