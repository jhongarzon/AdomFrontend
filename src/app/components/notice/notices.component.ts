import { Component, OnInit } from '@angular/core';
import { NoticesService } from '../../services/notice.service';
import { ParameterService } from '../../services/parameter.service';
import { Parameter } from '../../models/parameter';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Config } from "../../config/config";
import {DataListModule} from 'primeng/primeng';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Notice} from '../../models/notice';


declare var $ : any
declare var jQuery : any

 
@Component({
    selector: 'notices',
    templateUrl: 'notices.component.html'
})

export class NoticesComponent implements OnInit {
   
   notices: Notice[]
   public noticeInsert : Notice
   public isCreated : boolean

    constructor(private router: ActivatedRoute,private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private configuration: Config, private parameterService: ParameterService,private noticesService: NoticesService) {
       
        this.isCreated = window.location.href.indexOf('isCreated')==-1;
        this.initUser();
    }

    private initUser():void{
         this.noticeInsert =  new Notice();
        var date = new Date();
        this.noticeInsert.creationDate = date;
        let currentUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
        this.noticeInsert.creationUserName = currentUser.firstName + ' '+ currentUser.secondname + ' '+ currentUser.surname + ' '+currentUser.secondSurname;
        this.noticeInsert.noticeTitle = 'Nuevo Anuncio';
    }

    public create (): void 
    {
       this.configuration.ShowLoading();
        let currentUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
        this.noticeInsert.userId = currentUser.userId;
       this.noticesService.create(this.noticeInsert).subscribe((res) => {
            
                if (res.success) {
                    this.configuration.ShowAlertMessage('Se creó correctamente el anuncio.');
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }

                this.configuration.CloseLoading();
                this.LoadNotices();
                 this.initUser();
            });
        
    }

    public delete(noticeId:number):void
    {
        if(confirm('Desea eliminar el anuncio?'))
        {
            debugger;
         this.configuration.ShowLoading();
         
          this.noticesService.delete(noticeId).subscribe((res) => {
            
                if(res!=null)
                {
                    if (res.success) {
                        this.configuration.ShowAlertMessage('Se eliminó correctamente el anuncio.');
                    } else {
                        console.error(res.errors);
                        this.alertService.error(res.errors);
                    }

                    
                    this.LoadNotices();
                    this.initUser();
                }else
                {
                    this.alertService.error("Ocurrio un error intentado eliminar el anuncio");
                }
                    
                    this.configuration.CloseLoading();
                
            });
        }
    }
 
   public LoadNotices(): void
   {
       
        this.noticesService.getNotices().subscribe((res) => {
                if (res.success) {
                    this.notices = res.result;
                    $(".ui-datalist-content").css({"border":"0px"});
                } else {
                    console.error(res.errors);
                    this.alertService.error(res.errors);
                }
            });

   }

      public ngOnInit() {
      
       this.authenticationService.isAuthorize("/Notices/Get");
        this.LoadNotices();
        
        if(!this.isCreated)
        {
         $('#divContentNotices').css({"width":"100%"})
        }

    
    }
}
