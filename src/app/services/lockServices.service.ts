import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { ServiceFrecuency } from '../models/index';
import { AuthenticationService } from './authentication.service';
import { LockService } from "../models/lockService";

@Injectable()
export class LockServicesService {


    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    update(lockService: LockService) {
        return this.http.put(this.configuration.get("apiUrl") + 'LockServices/', JSON.stringify(lockService), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}