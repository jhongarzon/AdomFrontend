import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Patient } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class PatientService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'patient?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'patient', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getByNamesOrDocument(dataFind: string) {
        return this.http.get(this.configuration.get("apiUrl") + 'patient/' + dataFind, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'patient/' + id + "/1", this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(patient: Patient) {
        return this.http.post(this.configuration.get("apiUrl") + 'patient', JSON.stringify(patient), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(patient: Patient) {
        return this.http.put(this.configuration.get("apiUrl") + 'patient/' + patient.patientId, JSON.stringify(patient), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}