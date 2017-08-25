import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
declare var $ : any

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        // this.keepAfterNavigationChange = keepAfterNavigationChange;
        // this.subject.next({ type: 'success', text: message });
         $('#divTextMessage').html(message);
        $('#ModalMessage').css('display','block')
    }

    error(message: string, keepAfterNavigationChange = false) {
        // this.keepAfterNavigationChange = keepAfterNavigationChange;
        // this.subject.next({ type: 'error', text: message });
           $('#divTextMessage').html(message);
        $('#ModalMessage').css('display','block')
    }

    clean(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'clean', text: message });
    }

    errors(message: string[], keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;

        for(var i = 0; i <  message.length; i++){
            this.subject.next({ type: 'error', text: message[i] });
        }
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
