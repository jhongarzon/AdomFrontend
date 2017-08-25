import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from "../config/config";
import { User, Password } from '../models/index';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserService {
        

    constructor(private http: Http, private configuration: Config, private authenticationService: AuthenticationService) { 
    }  

    getAll(pageNumber:number, pageSize: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'user?pageNumber=' + pageNumber + '&pageSize=' + pageSize, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPagination() {
        return this.http.get(this.configuration.get("apiUrl") + 'user', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getAllWithoutPaginationActive() {
        return this.http.get(this.configuration.get("apiUrl") + 'user?active=1', this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.configuration.get("apiUrl") + 'user/' + id, this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(this.configuration.get("apiUrl") + 'user', JSON.stringify(user), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(this.configuration.get("apiUrl") + 'user/' + user.userId, JSON.stringify(user), this.authenticationService.jwt()).map((response: Response) => response.json());
    }

    ChangePassword(password: Password) { 
        return this.http.post(this.configuration.get("apiUrl") + 'user/1', JSON.stringify(password), this.authenticationService.jwt()).map((response: Response) => response.json());
    }
}