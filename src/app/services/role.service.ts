import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Role } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RoleService {m
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'role?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'role/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(role: Role) {
        return this.http.post(this.configuration.get("apiUrl") + 'role', JSON.stringify(role), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(role: Role) {
        return this.http.put(this.configuration.get("apiUrl") + 'role/' + role.roleId, JSON.stringify(role), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}