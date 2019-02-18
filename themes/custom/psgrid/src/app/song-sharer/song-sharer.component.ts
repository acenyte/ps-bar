import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { MatTabGroup } from '@angular/material';
import { MatTabChangeEvent } from '@angular/material';
import { SwiperComponent } from 'ngx-useful-swiper';
import { environment } from '../../environments/environment';
import { SongService } from '../../services/song/song.service';
import * as download from 'downloadjs';

@Component({
    selector: 'ps-song-sharer',
    templateUrl: './song-sharer.component.html',
    styleUrls: ['./song-sharer.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SongSharerComponent implements OnInit, AfterViewInit {

    constructor(
        private contentService: ContentService,
        private songService: SongService
    ) {
        this.baseURL = environment.base;
    }

    outputFileName = "valentines.mp3";
    iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    selectedTab = 0;
    recipient = '';
    resultURL: any;
    baseURL: any;

    result: any = {
        id: '',
        token: '',
    };

    canvas:  any;
    ctx: any;
    audio = new Audio();

    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    @ViewChild('albumSwiper') albumSwiper: SwiperComponent;

    configAlbum: any = {
        init: false,
        direction: 'horizontal',
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        centeredSlides: true,
        spaceBetween: 10,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoHeight: true
    };

    selectedSlide: any;

    emailText = ``;

    finalAlbum = {
        cover_id : 0,
        to_name : '',
        song_id: 0
    };

    /**
     * @param {any} options Holds the option arrays for songs and covers
     */
    options: any = {
        songs: [],
        covers: [],
    };

    songs: any = [];
    covers: any = [];

    /**
     * Component has initialised
     */
    ngOnInit() {
        // Get the content from the web service and set the options property
        window.scrollTo( 0, 0);
        this.contentService.getValentinesContent().subscribe( (data: Response) => {
            this.setData(data);
        });
    }

    /**
     * Sets the song options from the API response
     */
    setData(data) {

        // Set the songs
        data['songs'].forEach( (item, index) => {
            this.songs.push({
                nid: item.nid,
                text: item.title,
                file: item.file, // Path to file
                cover: item.cover,
                artist: item.artist,
                language: item.language,
            });
        });

        // Set the covers
        data['covers'].forEach( (item, index) => {
            this.covers.push({
                nid: item.nid,
                file: item.cover, // Path to file
                background: item.background,
            });
        });

    }

    /**
     * Comoponent view has initialised
     */
    ngAfterViewInit() {
        window.scrollTo( 0, 0);
    }


    /**
     * Selects a song
     */
    selectSong(event) {
        event.stopPropagation();

        const songButtons = document.getElementsByClassName('song');
        const targetElement = <HTMLElement>event.currentTarget;

        this.audio.src = targetElement.getAttribute('data-file');
        this.audio.currentTime = 0;

        for (let i = 0 ; i < songButtons.length ; i++ ) {

            if (songButtons[i].classList.contains('active')) {
                songButtons[i].classList.remove('active');
            }

            if (songButtons[i].classList.contains('paused')) {
                songButtons[i].classList.remove('paused');
            }
        }

        targetElement.classList.add('active');
        targetElement.classList.add('paused');


        this.finalAlbum.song_id = Number(targetElement.getAttribute('data-nid'));
    }

    /**
     * Plays a song and selects it
     */
    playSong(event) {
        event.stopPropagation();
        const songButtons = document.getElementsByClassName('song');
        const targetElement = <HTMLElement>event.currentTarget;

        if ( targetElement.parentElement.classList.contains('active') ) {

            if (targetElement.parentElement.classList.contains('paused')) {
                targetElement.parentElement.classList.remove('paused');
                this.audio.play();
            } else  {
                targetElement.parentElement.classList.add('paused');
                this.audio.pause();
            }

        } else {
            this.audio.src = targetElement.getAttribute('data-file');
            targetElement.parentElement.classList.add('loading');
            this.audio.play();
            this.finalAlbum.song_id = Number(targetElement.getAttribute('data-nid'));
            for (let i = 0 ; i < songButtons.length ; i++ ) {

                if (songButtons[i].classList.contains('paused')) {
                    songButtons[i].classList.remove('paused');
                }
            }
            window['dataLayer'].push({'event': 'Played song: ' + targetElement.getAttribute('data-file')});

        }

        for (let i = 0 ; i < songButtons.length ; i++ ) {

            if (songButtons[i].classList.contains('active')) {
                songButtons[i].classList.remove('active');
            }
        }

        this.audio.onended = function() {

            targetElement.parentElement.classList.add('paused');

        };

        this.audio.oncanplay = function() {

            targetElement.parentElement.classList.remove('loading');

        };

        targetElement.parentElement.classList.add('active');
    }

    playSongPreview() {
        const targetElement = <HTMLElement>document.getElementsByClassName('button--preview')[0];

        if ( targetElement.classList.contains('active') ) {

            if (targetElement.classList.contains('paused')) {
                targetElement.classList.remove('paused');
                this.audio.play();
            } else  {
                targetElement.classList.add('paused');
                this.audio.pause();
            }

        } else {
            this.audio.play();

            if (targetElement.classList.contains('paused')) {
                targetElement.classList.remove('paused');
            }

        }

        this.audio.onended = function() {

            targetElement.classList.add('paused');

        };

        targetElement.classList.add('active');
    }

    /**
     * Tab change events
     * @param {MatTabChangeEvent} tabChangeEvent ng material tab change event
     */
    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
        window.scrollTo( 0, 0);
        this.albumSwiper.swiper.init();
        this.selectedTab = tabChangeEvent.index;

        if (tabChangeEvent.index === 1) {
            this.albumSwiper.swiper.on('transitionEnd', () => {
                this.setCover();
            });

        }

        if (tabChangeEvent.index === 2) {

            if (this.iOS) {
                document.getElementById('download').style.display = 'none';
                document.getElementById('loader').style.display = 'none';
            }

            // Get the cover
            const cover = this.covers.find( (cover) => {
                return cover.nid == this.finalAlbum.cover_id;
            });

            // Get the song
            const song = this.songs.find( (song) => {
                return song.nid == this.finalAlbum.song_id;
            });

            // Draw the canvas
            this.canvas = document.getElementById('album__canvas');
            this.canvas.width = 1000;
            this.canvas.height = 1000;
            this.ctx = this.canvas.getContext('2d');

            const albumData = {
                cover: this.selectedSlide.getAttribute('src'),
                song: song.file,
                to: this.finalAlbum.to_name,
                artist: song.artist,
                songName: song.text,
                color: cover.background
            };

            this.songService.generateCover(albumData, this.ctx, () => {
                this.createSong();
            });


        }

    }

    /**
     * Sets the cover
     */
    setCover() {
        this.selectedSlide = document.querySelector('.swiper-slide-active').querySelector('.album__image');
        this.finalAlbum.cover_id = Number(this.selectedSlide.getAttribute('data-nid'));
        this.finalAlbum.to_name = this.recipient;
    }

    /**
     * Handles tab change events
     * @param {Number} n The index of the tab changed to
     */
    changeTab() {
        if (this.selectedTab === 0) {

            this.audio.pause();
            this.audio.currentTime = 0;
            const songButtons = document.getElementsByClassName('song');
            for (let i = 0 ; i < songButtons.length ; i++ ) {

                if (songButtons[i].classList.contains('active')) {
                    songButtons[i].classList.add('paused');
                }

            }
        }

        this.selectedTab ++;
    }

    /**
     * Creates a song via the API
     * Passes this.finalAlbum to the content service
     */
    createSong() {
        this.showLoader();

        this.canvas = document.getElementById('album__canvas');
        this.finalAlbum['meta'] = {};
        this.finalAlbum['meta']['image'] = this.canvas.toDataURL('image/jpeg');

        this.contentService.createValentinesSong(
            this.finalAlbum,
        ).subscribe( (response) => {
            this.result.id = response['data']['id'];
            this.result.token = response['data']['token'];
            this.resultURL = this.baseURL + 'ps/song-result/' + this.result.id + '/' + this.result.token;
            this.emailText = `%23FindLoveInYourLanguage%20${this.resultURL}&subject=A%20song%20made%20with%20Cadbury%20P.S`
        },
        (err) => {
            console.log(err);
        },
        () => {
            this.hideLoader();
        });
    }


    /**
     * Makes the request to the API to download the MP3 with meta
     */
    download() {

        this.showLoader();

        // Get the song
        const song = this.songs.find( (song) => {
            return song.nid == this.finalAlbum.song_id;
        });

        // Get the cover
        const cover = this.covers.find( (cover) => {
            return cover.nid == this.finalAlbum.cover_id;
        });

        const postData = {
            imageData: this.canvas.toDataURL("image/jpeg"),
            meta: {
                cover: this.selectedSlide.getAttribute('src'),
                song: song.file,
                to: this.finalAlbum.to_name,
                artist: song.artist,
                songName: song.text,
                color: cover.background
            }
        };

        this.contentService.postSongDownloadData(
            this.result.id,
            this.result.token,
            postData,
        ).subscribe( (resp) => {
            download(resp, this.outputFileName, 'audio/mpeg');
        },
        (err) => {
            console.log(err);
        },
        () => {
            this.hideLoader();
        });

    }

    hideLoader() {
        const socialButtons = document.getElementsByClassName('sb-wrapper');
        const downloadButton = document.getElementById('download');

        for (let i = 0; i < socialButtons.length; i++) {
           socialButtons[i].setAttribute('disabled', 'false');
        }

        for (let x = 0; x < socialButtons.length; x++) {
            socialButtons[x].removeAttribute('disabled');
        }

        downloadButton.setAttribute('disabled', 'false');
        downloadButton.removeAttribute('disabled');

        document.getElementById('loader').style.display = 'none';

    }

    showLoader() {
        const socialButtons = document.getElementsByClassName('sb-wrapper');
        const downloadButton = document.getElementById('download');

        for (let i = 0; i < socialButtons.length; i++) {
           socialButtons[i].setAttribute('disabled', 'true');
        }

        downloadButton.setAttribute('disabled', 'true');

        document.getElementById('loader').style.display = 'inline-block';

    }

    gaTrack(social) {
        window['dataLayer'].push({'event': 'Shared ' + this.audio.src + ' on ' + social});
    }

}
