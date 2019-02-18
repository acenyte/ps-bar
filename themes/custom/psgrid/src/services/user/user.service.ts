import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { environment } from '../../environments/environment';

import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    apiURL: string;

    constructor(private http: HttpClient) {

        this.apiURL = environment.api;

    }

    /**
     * Returns the parsed User object from local storage
     */
    get() {
        return JSON.parse(localStorage.getItem('ps_user'));
    }

    /**
     * Sets the user object for the provided values
     * @param id The user ID
     * @param token The user token
     */
    set(id, token, name) {
        const data = {
            id      : id,
            token   : token,
            name    : name
        };

        return localStorage.setItem('ps_user', JSON.stringify(data));
    }

    /**
     * Returns if an entry exists in local storage\
     * @return bool
     */
    isLoggedIn() {
        return null !== localStorage.getItem('ps_user');
    }

    /**
     * Clears the local storage key
     */
    clear() {
        localStorage.removeItem('ps_user');
    }

    getUser() {
        const user = this.get();
        const userId = this.get().id;
        const userToken =  this.get().token;
        return this.http.get(`${this.apiURL}/tokens/user/load/${userId}/${userToken}`);
    }

    createUser() {
        const userId = this.get().id;
        const userToken =  this.get().token;
        const userName = this.get().name;

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type'  :  'application/json',
            })
        };

        return this.http.post(
            `${this.apiURL}/tokens/user/create/${userId}/${userToken}`,
            userName,
            httpOptions
        );
    }

    claimCode(code) {
        const userId = this.get().id;
        const userToken =  this.get().token;

        return this.http.get(`${this.apiURL}/tokens/claim/${userId}/${userToken}/${code}`);
    }
}
