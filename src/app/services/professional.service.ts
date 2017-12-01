import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { Professional } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ProfessionalService {


    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getAll(pageNumber: number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'professional?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'professional', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'professional/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
   
    getByDocument(documentTypeId: number, document: string) {
        return this.http.get(this.configuration.get("apiUrl") + 'professional/' + documentTypeId + '/' + document, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(professional: Professional) {
        return this.http.post(this.configuration.get("apiUrl") + 'professional', JSON.stringify(professional), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(professional: Professional) {
        return this.http.put(this.configuration.get("apiUrl") + 'professional/' + professional.professionalId, JSON.stringify(professional), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}