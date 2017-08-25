import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Module } from '../../../models/module';
import { Resource } from '../../../models/resource';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $: any

@Component({
    selector: 'menu',
    templateUrl: 'menu.component.html'
})


export class MenuComponent implements OnInit, AfterViewInit {
    public modules: Module[] = [];
    public resources: Resource[] = [];
    public inMenuMode: boolean = false;
    public modulesMenu: Module[] = [];

    sessionUser: any;

    constructor(private authenticationService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router) {

        this.loadModulesAndResources();
        this.getModulesMenu();
        this.inMenuMode = true;

    }

    private loadModulesAndResources(): void {
        if (localStorage.getItem('currentUser')) {
            this.sessionUser = JSON.parse(JSON.parse(localStorage.getItem('currentUser')));
            let cont = 0;
            for (var i = 0; i < this.sessionUser.permissions.length; i++) {
                if (!this.existsModule(this.sessionUser.permissions[i].ModuleId)) {
                    this.resources = [];
                    let module = new Module();
                    module.moduleId = this.sessionUser.permissions[i].ModuleId;
                    module.name = this.sessionUser.permissions[i].ModuleName;
                    module.resources = this.getResourceByModuleId(this.sessionUser.permissions.filter(x => x.ModuleId == module.moduleId));
                    this.modules[cont] = module;
                    cont++;
                }
            }
        }
        else {
            this.inMenuMode = false;
        }
    }

    private getResourceByModuleId(permissionsByModule: any[]): Resource[] {
        let cont = 0;
        for (var i = 0; i < permissionsByModule.length; i++) {
            if (!this.existsResource(permissionsByModule[i].ResourceId) && permissionsByModule[i].VisibleResource) {
                let resource = new Resource();
                resource.resourceId = permissionsByModule[i].ResourceId;
                resource.name = permissionsByModule[i].ResourceName;
                resource.routeFrontEnd = permissionsByModule[i].RouteFrontEnd;
                this.resources[cont] = resource;
                cont++;
            }
        }

        return this.resources;
    }

    private existsResource(resourceId: number): boolean {
        for (var i = 0; i < this.resources.length; i++) {
            if (this.resources[i].resourceId == resourceId) {
                return true;
            }
        }

        return false;
    }

    private existsModule(moduleId: number): boolean {
        for (var i = 0; i < this.modules.length; i++) {
            if (this.modules[i].moduleId == moduleId) {
                return true;
            }
        }

        return false;
    }

    private getModulesMenu() {
        for (var i = 0; i < this.modules.length; i++) {
            this.modules[i].nameDataActivates = "data-activates='" + this.modules[i].moduleId + "'";
            //this.modulesMenu = this.modulesMenu + "<li><a class=\"dropdown-button\" data-activates=\"1\">" + this.modules[i].name  + "<i class=\"material-icons right\">arrow_drop_down</i></a></li>";
        }
    }

    public ngOnInit() {

    }

    public ngAfterViewInit() {
        $(".button-collapse").sideNav();
        $(".dropdown-button").dropdown({ belowOrigin: true});
        $('.collapsible').collapsible();
    }

    public logOut() {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
    }
}