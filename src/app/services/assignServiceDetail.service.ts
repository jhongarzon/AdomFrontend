import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AssignServiceDetail } from '../models/index';
import { AuthenticationService } from './authentication.service';
import { QualityQuestion } from '../models/qualityQuestion';

@Injectable()
export class AssignServiceDetailService {


    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'assignServiceDetail', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getByAssignServiceId(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'assignServiceDetail/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(assignServiceId: number, assignServicesDetail: AssignServiceDetail[]) {
        return this.http.put(this.configuration.get("apiUrl") + 'assignServiceDetail/' + assignServiceId, JSON.stringify(assignServicesDetail), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
    getQualityQuestionsByService(serviceId: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'questions/' + serviceId, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
    saveQualityTest(assignServicesDetailId: number, answers: QualityQuestion[]) {
        return this.http.post(this.configuration.get("apiUrl") + 'questions/' + assignServicesDetailId, JSON.stringify(answers), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}    