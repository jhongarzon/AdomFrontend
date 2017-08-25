import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions, Http, Response, Request, RequestOptionsArgs, XHRBackend, ConnectionBackend, Headers, ResponseContentType } from '@angular/http';
import { Config } from "../config/config";
import { AlertService } from './alert.service';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Resource } from '../models/resource';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import "rxjs/add/observable/throw";
import "rxjs/add/observable/empty";

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private configuration: Config, private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router, ) { }

    public userName: String;

    login(username: string, password: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let json = JSON.stringify({ Email: username, Password: password });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.configuration.get("apiUrl") + 'account', json, options)
            .map(res => res.json());
    }

    jwt() {
        let currentUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            headers.append('Content-Type', 'application/json');
            return new RequestOptions({ headers: headers });
        }
    }
    jwtDownloadZip() {
        let currentUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/zip');
            return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        }
    }
    jwtDownloadExcel() {
        let currentUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        }
    }


    isAuthorize(routePath: string) {
        this.isExpiredToken();
        let currentUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.configuration.get("apiUrl") + 'account?id=' + currentUser.userId + '&route=' + routePath, options).map((response: Response) => response.json())
            .subscribe((res) => {
                if (res.success && !res.result) {
                    this.router.navigate(["/error"]);
                    this.alertService.error("No tiene permisos para acceder a este recurso.");
                }
            });
    }

    isExpiredToken(): Observable<Response> {
        return this.http.put(this.configuration.get("apiUrl") + 'account/1', null, this.jwt())
            .catch((err, source) => {
                if (err.status == 401) {
                    this.router.navigate(['/login']);
                    return Observable.empty();
                } else {
                    return Observable.throw(err);
                }
            });
        /*.catch(e => {
            if (this.isUnauthorized(e.status)) {
                this.router.navigate(['Login']);
                return null;
            }
        }); */
    }

    isUnauthorized(status: number): boolean {
        return status === 401;
    }

    hasPermissionResourceAction(routePath: string): boolean {
        let sessionUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
        let resource = sessionUser.permissions.filter(x => x.Route == routePath);

        if (resource != null && resource.length > 0) {
            return true;
        }
        return false;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }

    isAuthenticated(): boolean {
        return localStorage.getItem("currentUser") != null;
    }

    getUserName() {
        if (this.isAuthenticated()) {
            let sessionUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
            return sessionUser.firstName + " " + sessionUser.secondname;
        } else return "";
    }

    getEmail() {
        if (this.isAuthenticated()) {
            let sessionUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
            return sessionUser.email;
        } else return "";
    }
    getUserId() {
        if (this.isAuthenticated()) {
            let sessionUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
            return sessionUser.userId;
        } else return "";
    }

    recoverPassword(email: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.configuration.get("apiUrl") + 'account/' + email, options).map((response: Response) => response.json());
    }
}