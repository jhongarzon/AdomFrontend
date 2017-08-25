import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { HomeReport } from '../models/homeReport';
import { Config } from "../config/config";
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HomeService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getReport() {
        return this.http.get(this.configuration.get("apiUrl") + '/home',
            this.authenticationService.jwt())
            .map((response: Response) => response.json());
    }
}