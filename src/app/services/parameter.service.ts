import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Parameter } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ParameterService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getData(parametricTable: string) {
        return this.http.get(this.configuration.get("apiUrl") + 'parameter?parametricTable=' + parametricTable, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}