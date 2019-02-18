import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SongService } from '../../services/song/song.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as download from 'downloadjs';

@Component({
    selector: 'ps-song-result',
    templateUrl: './song-result.component.html',
    styleUrls: ['./song-result.component.scss']
})

export class SongResultComponent implements OnInit, AfterViewInit {

    constructor(
        private contentService: ContentService,
        private songService: SongService,
        private activatedRoute: ActivatedRoute,
    ) { }

    outputFileName = "valentines.mp3";
    audio = new Audio();

    iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    result: any;
    valentinesData: any;
    canvas:  any;
    ctx: any;

    albumData: any = {
        cover: '',
        song: '',
        to: '',
        artist: '',
        songName: '',
        color: '',
    };


    route: any = {
        id: '',
        token: '',
    };

    emailText = `%23FindLoveInYourLanguage%20${window.location.href}&subject=A%20song%20made%20with%20Cadbury%20P.S`

    /**
     * Component has initialised
     */
    ngOnInit() {

        this.contentService.getValentinesContent().subscribe( (data: Response) => {

            // Set the valentines data
            this.valentinesData = data;

            this.activatedRoute.params.subscribe((params: Params) => {
                // Make the request to the API to load this result item
                // Pass through the query params nid / token
                this.route.id = params['nid'];
                this.route.token = params['token'];

                this.contentService.loadValentinesSongResult(
                    this.route.id,
                    this.route.token
                ).subscribe( ( data: Response ) => {
                    if ( data['success'] ) {
                        this.result = data['data'];
                        this.renderResult();
                    }
                });
            });
        });

    }

    ngAfterViewInit() {
        if (this.iOS) {
            document.getElementById('download').style.display = 'none';
            document.getElementById('loader').style.display = 'none';
        }
    }

    /**
     * Renders the result
     */
    renderResult() {
        // Get the cover
        const cover = this.valentinesData.covers.find( (cover) => {
            return cover.nid == this.result.cover_id;
        });

        // Get the song
        const song = this.valentinesData.songs.find( (song) => {
            return song.nid == this.result.song_id;
        });

        this.albumData.cover = cover.cover;
        this.albumData.song = song.file;
        this.audio.src = this.albumData.song = song.file;

        this.audio.oncanplay = function() {
            document.getElementsByClassName('button--preview')[0].classList.remove('loading');

        };

        this.albumData.to = this.result.to_name;
        this.albumData.artist = song.artist;
        this.albumData.songName = song.title;
        this.albumData.color = cover.background;

        // Generate the cover
        this.canvas = document.getElementById('album__canvas');
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.ctx = this.canvas.getContext('2d');

        this.songService.generateCover(this.albumData, this.ctx, function() {
        });

    }

    /**
     * Makes the request to the API to download the MP3 with meta
     */
    download() {
        // Read the image data from the canvas as base64
        const postData = {
            imageData: this.canvas.toDataURL('image/jpeg'),
            meta: this.albumData,
        };

        this.contentService.postSongDownloadData(
            this.route.id,
            this.route.token,
            postData,
        ).subscribe( (resp) => {
            download(resp, this.outputFileName, 'audio/mpeg');
        });

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

}

