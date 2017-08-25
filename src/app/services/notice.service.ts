import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Notice } from '../models/notice';
import { Config } from "../config/config";
import { Parameter } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class NoticesService {
    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) {
    }

    getNotices() {
        return this.http.get(this.configuration.get("apiUrl") + 'notices',
            this.authenticationService.jwt())
            .map((response: Response) => response.json());
    }

    create(notice: Notice) {
        return this.http.post(this.configuration.get("apiUrl") + 'notices', JSON.stringify(notice), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    delete(noticeId: number) {
        return this.http.put(this.configuration.get("apiUrl") + 'notices/' + noticeId, null, this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}