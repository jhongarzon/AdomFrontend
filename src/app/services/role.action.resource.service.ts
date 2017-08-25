import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { RoleActionResource } from '../models/role.action.resource';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RoleActionResourceService {

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getActionsResourcesByRoleId(roleId: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'roleactionresource?roleId=' + roleId, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    createRoleActionResource(roleActionResource: RoleActionResource) {
        return this.http.post(this.configuration.get("apiUrl") + 'roleactionresource', JSON.stringify(roleActionResource), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}