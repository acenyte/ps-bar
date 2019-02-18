import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { IUser } from '../../interfaces/user.interface';
import { IClaim } from '../../interfaces/claim.interface';

import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'ps-profile-menu',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProfileMenuComponent implements OnInit, AfterViewInit {
    user: IUser;
    claimData: IClaim;
    packNumber: string;
    resultText: string;
    endBalance: number;
    userName: string;

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        window.scrollTo( 0, 0);
        this.resultText = '';
        this.user = {
            id: 0,
            user_id: '',
            token: '',
            balance: 0
        };
    }

    ngAfterViewInit() {

        if (0 !== window['userId']) {
            this.userService.set(
                window['userId'],
                window['userToken'],
                window['userName']
            );

            this.userService.getUser().subscribe((data: IUser) => {

                if ( !data ) {
                    this.userService.createUser().subscribe((resp) => {

                        this.initUser(resp);
                    });
                } else {
                    this.initUser(data);
                }
            });

            this.userName = this.userService.get().name;
        }
    }

    animateBalance(start) {

        const end = this.user.balance;
        const range = end - start;
        let current = start;
        const increment = 1;
        const stepTime = Math.abs(Math.floor(1000 / range));
        const obj = document.querySelector('.profile__number');
        const timer = setInterval(function () {
            current += increment;
            obj.innerHTML = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    initUser(data) {
        this.user = data;
    }

    claim() {
        this.resultText = '';

        this.userService.claimCode(this.packNumber).subscribe((claimData: IClaim) => {
            if (claimData.success === false) {
                this.resultText = claimData['message'];
            } else {
                const startBalance = this.user.balance;
                this.userService.getUser().subscribe((data: IUser) => {
                    this.initUser(data);
                    this.animateBalance(startBalance);
                });

            }

        });
    }

    logOut() {

        window.location.pathname = '/psbar/auth/logout';

	}

}
