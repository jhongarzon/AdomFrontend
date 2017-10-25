import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { AuthenticationService } from './authentication.service';
import { Copayment } from '../models/copayment';
import { RipsFilter } from '../models/ripsFilter';
import { RipsGenerationData } from "../models/ripsGenerationData";

@Injectable()
export class RipsService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getRips(entityId: number, planEntityId: number, serviceTypeId: number, initialDateIni: string, initialDateEnd: string, finalDateIni: string, finalDateEnd: string) {
        return this.http.get(this.configuration.get("apiUrl") + 'Rips?EntityId=' + entityId + '&EntityPlanId=' + planEntityId + '&serviceTypeId=' + serviceTypeId + '&initialDateIni=' + initialDateIni + '&initialDateEnd=' + initialDateEnd +'&finalDateIni=' + finalDateIni  +'&finalDateEnd=' + finalDateEnd, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
    generateRips(ripsGenerationData: RipsGenerationData) {
        return this.http.post(this.configuration.get("apiUrl") + 'Rips', JSON.stringify(ripsGenerationData), this.authenticationService.jwtDownloadZip())
            .map((response: Response) => {
                return new Blob([response.blob()], { type: 'application/zip' });
            });
    }
}