import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
declare var $: any
declare var $: any

@Injectable()
export class Config {
    private config: Object
    private env: Object

    constructor(private http: Http) {

    }

    public CloseLoading() {
        $('.preloader-background').hide();

    }

    public ShowLoading() {
        $('.preloader-background').show();
    }

    public ShowAlertMessage(message: String) {
        $('#divTextMessage').html(message);
        $('#ModalMessage').css('display', 'block')
    }

    public ConfigHeightModals() {
        //Se agrega el porcentaje al modal
        var tamHeight = Math.floor($(window).height() * 0.8);
        //alert(tamHeight);
        $('p-dialog').height(tamHeight);
        $('.ui-dialog-content').height(tamHeight);

    }
    public load() {
        return new Promise((resolve, reject) => {
            try {
                this.http.get('assets/content/env.json').map(res => res.json()).subscribe(
                    (envResponse: any) => {
                        this.env = envResponse;
                        let request: any = null;
                        this.http.get('assets/content/' + envResponse.env + '.json').map(res => res.json()).subscribe(
                            (responseData: any) => {
                                this.config = responseData;
                                resolve(true);
                            },
                            error => {
                                console.error('Error reading ' + envResponse.env + ' configuration file');
                                resolve(error);
                                return Observable.throw(error.json().error || 'Server error');
                            }
                        )
                    },
                    error => {
                        console.log('Configuration file "env.json" could not be read');
                        resolve(true);
                        return Observable.throw(error.json().error || 'Server error');
                    }
                );
            } catch (error) {
                debugger;
            }


        });
    }

    getEnv(key: any) {
        return this.env[key];
    }

    get(key: any) {
        return this.config[key];
    }
};