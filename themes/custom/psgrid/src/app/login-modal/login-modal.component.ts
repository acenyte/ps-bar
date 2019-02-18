import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'ps-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoginModalComponent implements OnInit, AfterViewInit {

    constructor(private sanitizer: DomSanitizer) {}

    registerURL: string;

    ngOnInit() {}

    ngAfterViewInit() {
        if (document.getElementById('block-psregisterurl')) {
            this.registerURL = (<HTMLElement>document.getElementById('block-psregisterurl')).innerHTML;
            this.registerURL = this.registerURL.replace(/<(.|\n)*?>/g, '');
        }
    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    /**
     * Handles the oauth form submit
     * @param type The type of submit
     */
    submitOauthForm(type) {
        (<HTMLInputElement>document.getElementById('edit-selected-field')).value = type;
        (<HTMLFormElement>document.getElementById('openid-connect-login-form')).submit();
        return false;
    }

}
