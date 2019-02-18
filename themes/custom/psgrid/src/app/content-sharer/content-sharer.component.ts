import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    ViewChild
} from '@angular/core';

import {
	Router
} from '@angular/router';

import { FormBuilder, FormControl , Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IOption } from '../../interfaces/option.interface';
import { ContentService } from '../../services/content/content.service';
import { ProfanityService } from '../../services/profanity/profanity.service';
import { ActivatedRoute } from '@angular/router';
import { SwiperComponent } from 'ngx-useful-swiper';
import { MatTabChangeEvent } from '@angular/material';
import { MatTabGroup } from '@angular/material';
import { environment } from '../../environments/environment';
import * as download from 'downloadjs';

@Component({
	selector: 'ps-content-sharer',
	templateUrl: './content-sharer.component.html',
    styleUrls: ['./content-sharer.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContentSharerComponent implements OnInit, AfterViewInit {

    options: IOption[];
    canvas:  any;
    canvas2:  any;
    ctx: any;
    ctx2: any;
    selectedOption: any;
    contentType: string;
    contentId: number;
    selectedTab = 0;
    resultURL: any;
    baseURL: any;
    resultImg: any;
    faceBookResultImage: any;
    selectedFont = '38px BowlbyOne-Regular';
    profanityCheckFrom: boolean;
    profanityCheckTo: boolean;
    socialReady = false;

    @ViewChild('usefulSwiper') usefulSwiper: SwiperComponent;
    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    urlToType: any;

    config: any = {
        preloadImages: true,
        updateOnImagesReady: true,
        direction: 'horizontal',
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        centeredSlides: true,
        spaceBetween: 10,
        freeMode: false,
        freeModeSticky: false,
        grabCursor: true
    };

    swiperOrder: any = {};

    inputData: any = {
        active: true,
        fromName: {
            x: 20,
            y: 780,
            value: ''
        },
        toName: {
            x: 20,
            y: 60,
            value: ''
        },
        font: {
            color: 'white',
            name: '38px BowlbyOne-Regular',
        },
        image: '',
        nid: 0
    };

    fonts: any = [
        {
            name: 'Anton',
            value: '42px Anton',
        },
        {
            name: 'Bangers',
            value: '40px Bangers',
        },
        {
            name: 'Bowlby One',
            value: '38px BowlbyOne-Regular',
        },
        {
            name: 'Bungee',
            value: '42px Bungee',
        },
        {
            name: 'Fredoka One',
            value: '40px Fredoka One',
        },
        {
            name: 'Hanalei Fill',
            value: '40px Hanalei Fill',
        },
        {
            name: 'Kalam',
            value: '42px Kalam',
        },
        {
            name: 'Knewave',
            value: '40px Knewave',
        },
        {
            name: 'Pacifico',
            value: '40px Pacifico',
        },
        {
            name: 'Passion One',
            value: '40px Passion One',
        },
        {
            name: 'Permanent Marker',
            value: '42px Permanent Marker',
        },
        {
            name: 'Sedgwick Ave',
            value: '40px Sedgwick Ave',
        },
        {
            name: 'Sigmar One',
            value: '40px Sigmar One',
        },
    ];

    result: any = {
        id: '',
        token: '',
    };

    relationShipCategoryParent = 'ps_option_relationship';
    personalisedCategoryParent = 'ps_option_personalised';

	constructor(
        private contentService: ContentService,
        private profanityService: ProfanityService,
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private _formBuilder: FormBuilder
    ) {
        this.baseURL = environment.base;
    }

	ngOnInit() {
        window.scrollTo( 0, 0);

        this.initCanvas();
        this.options = [];
        this.urlToType =  {
            'relationship-tip': 'ps_relationship_item',
            'iou': 'ps_option_iou',
            'personalised': 'personalised_item',
        };

        this.profanityCheckFrom = false;
        this.profanityCheckTo = false;

        this.route.params.subscribe(params => {
            this.contentId = params['nid'];
            this.contentType = this.urlToType[params['type']];


            this.inputData.active = (this.contentType === 'personalised_item');
            this.inputData.nid = this.contentId;

            this.contentService.getContent().subscribe( (data: Response) => {
                this.initPreview(data);
                this.usefulSwiper.swiper.slideTo( this.swiperOrder[this.contentId] );
            });

        });

    }

    ngAfterViewInit() {
    }

    /**
     * Init the canvas
     */
    initCanvas() {
        this.canvas = document.getElementById('content-sharer__canvas');

        this.canvas.width = 800;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');

        this.canvas2 = document.getElementById('content-sharer__canvas2');

        this.canvas2.width = 1200;
        this.canvas2.height = 630;
        this.ctx2 = this.canvas2.getContext('2d');
    }

    /**
     * Make a request to the getContent API and set options
     * Loads the canvas and thumbnail gallery
     */
    initPreview(data) {

        // If the current type is relationship, filter by parent category first
        if ( 'ps_relationship_item' === this.contentType ) {

            const relationshipParent = data.options.find((item) => {
                return this.relationShipCategoryParent === item.type;
            });

            this.options = relationshipParent.items;

            // Draw the first item in the options array
            if ( this.options.length > 0 ) {
                this.contentId = this.options[0].nid;
            }

        } else {
            // this.options = data.options.filter(option => option.type === this.contentType);

            const personalisedParent = data.options.find((item) => {
                return this.personalisedCategoryParent === item.type;
            });

            this.options = personalisedParent.items;

            // Draw the first item in the options array
            if ( this.options.length > 0 ) {
                this.contentId = this.options[0].nid;
            }
        }

        let i = 0;
        this.options.forEach(item => {
            this.swiperOrder[item.nid] = i;
            i++;
        });

        this.selectOption(null, this.contentId);
    }

    /**
     * Set the specified nid active
     */
    selectOption(event, nid) {
        this.contentId = nid;
        this.drawCanvas();
    }

    /**
     * Draws the canvas
     */
    drawCanvas() {

        const wideX = 285;
        const targetOption = this.options.find( (element) => {
            return element.nid == this.contentId;
        });

        if ( targetOption ) {

            const image = new Image();

            image.onload = () => {
                this.ctx.drawImage(image, 0, 0);

                this.ctx2.fillStyle = 'white';
                this.ctx2.fillRect(0, 0, this.canvas2.width, this.canvas2.height);
                this.ctx2.drawImage(image, wideX, 0 , 630, 630);



                // Write the text to the canvas

                if ( <HTMLInputElement>document.querySelector('.input__from') ) {

                    this.inputData.fromName.value = (
                        <HTMLInputElement>
                        document.querySelector('.input__from')).value.toUpperCase();

                    this.inputData.toName.value = (
                        <HTMLInputElement>
                        document.querySelector('.input__to')).value.toUpperCase();

                }

                if ( this.inputData.active ) {
                    this.ctx.fillStyle = this.inputData.font.color;
                    this.ctx.font = this.inputData.font.name;
                    this.ctx.shadowColor = 'black';
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 0;
                    this.ctx.shadowBlur = 10;

                    this.ctx2.fillStyle = this.inputData.font.color;
                    this.ctx2.font = this.inputData.font.name;
                    this.ctx2.shadowColor = 'black';
                    this.ctx2.shadowOffsetX = 0;
                    this.ctx2.shadowOffsetY = 0;
                    this.ctx2.shadowBlur = 10;

                    this.profanityCheckFrom = this.profanityService.check(this.inputData.fromName.value);
                    this.profanityCheckTo = this.profanityService.check(this.inputData.toName.value);

                    if (this.inputData.fromName.value !== '') {
                        this.ctx.fillText('FROM: ' + this.inputData.fromName.value, this.inputData.fromName.x, this.inputData.fromName.y);

                        this.ctx2.fillText('FROM: ' + this.inputData.fromName.value,
                                            (this.inputData.fromName.x  + wideX),
                                            (this.canvas2.height - 20));
                    }
                    if (this.inputData.toName.value !== '') {
                        this.ctx.fillText('DEAR: ' + this.inputData.toName.value, this.inputData.toName.x, this.inputData.toName.y);

                        this.ctx2.fillText('DEAR: ' + this.inputData.toName.value,
                                            (this.inputData.toName.x + wideX),
                                            this.inputData.toName.y);
                    }
                }


                if ( 'ps_relationship_item' === this.contentType ) {
                    this.inputData.image = targetOption.images.original;
                    //this.saveResult();
                }
            };
            image.src = targetOption.images.original;

            this.inputData.image = targetOption.images.original;

        }

    }

    changeFont() {
        const optionText = document.querySelector('.mat-select-value-text') as HTMLElement;

        this.inputData.font.name = this.selectedFont;
        this.drawCanvas();

        optionText.style.font = this.selectedFont;

    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {

        // Check if we're moving to the share tab
        // If so, save the result via the API
        if ( tabChangeEvent.tab.textLabel === 'Share it' ) {
            this.saveResult();
        }

        this.selectedTab = tabChangeEvent.index;
    }

    changeTab(n) {
        this.selectedTab = n;
    }

    saveResult() {
        this.resultImg = this.canvas.toDataURL('image/jpeg');
        this.faceBookResultImage = this.canvas2.toDataURL('image/jpeg');
        this.showLoader();

        const saveMeta = this.inputData;
        saveMeta.result_image = this.resultImg;
        saveMeta.result_image_facebook = this.faceBookResultImage;

        this.contentService.saveResult({
            type: this.contentType,
            meta: saveMeta,
        }).subscribe( (resp) => {
            document.querySelector('.social-container')
            .classList.add('social-container__active');

            this.result.id = resp['id'];
            this.result.token = resp['token'];
            this.resultURL = this.baseURL + 'ps/result/' + this.result.id + '/' + this.result.token;

        },
        (err) => {
            console.log(err);
        },
        () =>  {
            this.hideLoader();
        });
    }

    skipTab() {
        (<HTMLInputElement>document.querySelector('.input__from')).value = '';
        (<HTMLInputElement>document.querySelector('.input__to')).value = '';

        this.drawCanvas();
        this.changeTab(2);
    }

    hideLoader() {
        const socialButtons = document.getElementsByClassName('sb-wrapper');

        for (let i = 0; i < socialButtons.length; i++) {
           socialButtons[i].setAttribute('disabled', 'true');
        }

        for (let x = 0; x < socialButtons.length; x++) {
            socialButtons[x].removeAttribute('disabled');
        }
        document.getElementById('loader').style.display = 'none';

    }

    showLoader() {
        const socialButtons = document.getElementsByClassName('sb-wrapper');

        for (let i = 0; i < socialButtons.length; i++) {
           socialButtons[i].setAttribute('disabled', 'false');
        }

        document.getElementById('loader').style.display = 'inline-block;';

    }

    downloadFile(filename) {
        download(this.resultImg, filename, 'image/jpeg');
    }

}
