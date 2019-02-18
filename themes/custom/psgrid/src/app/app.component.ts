import { Component, ViewEncapsulation, AfterViewInit, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoginModalComponent } from './login-modal/login-modal.component';

import { UserService } from '../services/user/user.service';

@Component({
	selector: 'ps-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit  {

	title = 'app';
    selectedFilter: string;
    userLoggedIn: boolean;
    user: any = {};
    dialogRef: any;

    constructor(
        public router: Router,
        public dialog: MatDialog,
        private userService: UserService,
        private route: ActivatedRoute,
    ) {}

    openDialog() {
        this.dialogRef = this.dialog.open(LoginModalComponent);
        this.dialogRef.beforeClose().subscribe(result => {

            const originElement = document.getElementById('oauth-clone-origin');
            const clonedElement = originElement.cloneNode(true);

            originElement.outerHTML = ''; // Remove the source element

            // const elem = document.createElement('div');
            // elem.style.display = 'none';
            // elem.setAttribute('id', 'oauth-clone-origin');
            document.body.appendChild(clonedElement);
            document.getElementById('oauth-clone-origin').style.display = 'none';

        });

        this.dialogRef.afterOpen().subscribe(result => {
            this.setupOauth();
        });

    }

    recieveFilter($event) {
		this.selectedFilter = $event;
    }

    ngAfterViewInit() {

    }

    ngOnInit() {


        // Check if the user is logged an and get the user
        if ( 0 !== window['userId'] ) {
            this.userService.set(
                window['userId'],
                window['userToken'],
                window['userName']
            );

            this.user = this.userService.get();
            this.loadUser();
            this.userLoggedIn = true;
        } else {
            this.userLoggedIn = false;
            this.userService.clear();
        }

        if (window.location.search.indexOf('postreg=done') > -1 ) {
            if ( document.getElementById('edit-selected-field') != null ) {
                this.submitOauthForm('generic');
            }
        }
    }

    loadUser() {
        this.userService.getUser().subscribe( (data: Response) => {
            if ( !data['success'] === undefined ) {
                    this.userService.createUser().subscribe( (resp) => {
                    this.loadUser();
                });
            }
        });
    }

    setupOauth() {

        const originElement = document.getElementById('oauth-clone-origin');
		const clonedElement = originElement.cloneNode(true);
		const cloneTarget = document.getElementById('oauth-clone-target');

		cloneTarget.appendChild(clonedElement);
        originElement.outerHTML = ''; // Remove the source element

        document.getElementById('edit-openid-connect-client-generic-login').onclick = () => {
            this.submitOauthForm('generic');
        };

        document.getElementById('edit-openid-connect-client-facebook-login').onclick = () => {
            this.submitOauthForm('facebook');
        };

        document.getElementById('openid-connect-login-form').onsubmit = () => {
            return false;
        };

        document.getElementById('oauth-clone-origin').style.display = 'block';

    }

    submitOauthForm(type) {
        (<HTMLInputElement>document.getElementById('edit-selected-field')).value = type;
        (<HTMLFormElement>document.getElementById('openid-connect-login-form')).submit();
        return false;
    }

    atHome() {
        let result = true;
        const urlTree = this.router.parseUrl(this.router.url);

            if ( urlTree.root.numberOfChildren > 0 ) {
                result = true;

            } else {
                result = false;
            }


        return result;
    }

}
