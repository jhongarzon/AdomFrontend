import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { UserRole } from '../models/user.role';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserRoleService {

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getRolesByUserId(useId: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'userrole?userId=' + useId, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    createUserRole(userRole: UserRole) {
        return this.http.post(this.configuration.get("apiUrl") + 'userrole', JSON.stringify(userRole), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}