
import { Injectable } from '@angular/core';

import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IContentCategories } from '../../interfaces/categories.interface';
import { IResult } from '../../interfaces/result.interface';

@Injectable({
    providedIn: 'root'
})

export class ContentService {

    apiURL: string;

    constructor(private http: HttpClient) {

        this.apiURL = environment.api;

    }

    getContent() {

       return this.http.get(`${this.apiURL}/content`);

    }

    getValentinesContent() {
        return this.http.get(`${this.apiURL}/valentines/content`);
    }

    /**
     * Returns the specified result from the API
     * @param id
     * @param token
     */
    getResult(id, token) {
        return this.http.get(`${this.apiURL}/result/load/${id}/${token}`);
    }

    sendResults(postData): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type'  :  'application/json',
            })
        };

        return this.http.post(
            `${this.apiURL}/result/create`,
            postData,
            httpOptions
        );

    }

    /**
     * Saves the result to the web service
     */
    saveResult(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type'  :  'application/json',
            })
        };

        return this.http.post(
            `${this.apiURL}/result/create`,
            data,
            httpOptions
        );
    }

    /**
     * Saves a valentines competition entry
     */
    createValentinesEntry(data) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type'  :  'application/json',
            })
        };

        return this.http.post(
            `${this.apiURL}/valentines/entry/create`,
            data,
            httpOptions
        );
    }

    /**
     * Creates the shareable song entry via the API
     */
    createValentinesSong(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type'  :  'application/json',
            })
        };

        return this.http.post(
            `${this.apiURL}/valentines/song/create`,
            data,
            httpOptions
        );
    }

    /**
     * Loads the specified valentines song
     * @param {Number} id The id of the item to load
     * @param {String} token The token of the item to load
     */
    loadValentinesSongResult(id, token) {
        return this.http.get(`${this.apiURL}/valentines/song/load/${id}/${token}`);
    }

    /**
     * Makes a post request to the API to download the song data
     * @param {Number} id The id of the song result
     * @param {String} token The token of the song result
     * @param {Object} postData The data to be posted, base64 image data of the album artwork, and meta data
     */
    postSongDownloadData(id, token, postData) {

        return this.http.post(
            `${this.apiURL}/valentines/song/download/${id}/${token}`,
            postData,
            {
                headers: new HttpHeaders({
                    'Content-Type'  :  'application/json',
                }),
                responseType: 'blob',
            }
        );

    }
}
