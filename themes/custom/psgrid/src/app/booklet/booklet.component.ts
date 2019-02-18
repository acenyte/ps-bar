import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, ChangeDetectorRef, AfterViewChecked  } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { PdfService } from '../../services/pdf/pdf.service';
import { SwiperComponent } from 'ngx-useful-swiper';
import { MatTabChangeEvent } from '@angular/material';
import { MatTabGroup } from '@angular/material';
import { ProfanityService } from '../../services/profanity/profanity.service';
import { environment } from '../../environments/environment';
import {
    Router,
    ActivatedRoute
} from '@angular/router';

import { FormArray, FormControl } from '@angular/forms';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'ps-booklet',
  templateUrl: './booklet.component.html',
  styleUrls: ['./booklet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookletComponent implements OnInit, AfterViewInit, AfterViewChecked {

    covers: any[];
    vouchers: any[];
    contentId: number;


    uncheckedVouchers: any;
    checkedVouchers: any;
    recipient: string;
    selectedSlide: any;
    finalBooklet: {
        cover,
        vouchers,
        name,
        color,
        nid
    };
    canvas:  any;
    ctx: any;
    canvas2:  any;
    ctx2: any;
    selectedTab = 0;
    maxVouchers = 10;
    resultURL: any;
    baseURL: any;
    profanityCheckTo: boolean;
    nameEmpty: boolean;

    result: any = {
        id: '',
        token: '',
    };

    @ViewChild('iouSwiper') iouSwiper: SwiperComponent;
    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    configIOU: any = {
        direction: 'horizontal',
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        centeredSlides: true,
        spaceBetween: 10,
        grabCursor: true
    };

    constructor(
        private contentService: ContentService,
        private pdfService: PdfService,
        private cdRef: ChangeDetectorRef,
        private profanityService: ProfanityService,
        private router: Router,
        private route: ActivatedRoute,

    ) {
        this.baseURL = environment.base;
    }

    ngOnInit() {
        window.scrollTo(0 , 0);

        this.recipient = '';
        this.finalBooklet = {
            cover: '',
            vouchers: [],
            name: '',
            color: '',
            nid: 0
        };

        this.route.params.subscribe(params => {
            this.contentId = params['nid'];
        });

        this.contentService.getContent().subscribe( (data: Response) => {
            this.initPreview(data);
        });
        this.profanityCheckTo = false;
        this.nameEmpty = true;
    }

    ngAfterViewInit() {
        this.iouSwiper.swiper.on('transitionEnd', () => { this.setCover(); });
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();

    }

    initPreview(data) {
        this.covers = data.options.filter(option => option.type === 'ps_option_iou')[0].covers;
        this.vouchers = data.options.filter(option => option.type === 'ps_option_iou')[0].pages;
    }

    chooseVoucher(path) {

        setTimeout(() => {
            this.checkedVouchers = document.querySelectorAll('.mat-checkbox-checked');
            this.uncheckedVouchers = document.querySelectorAll('.mat-checkbox:not(.mat-checkbox-checked)');

            this.finalBooklet.vouchers = [];

            for (let i = 0 ; i < this.checkedVouchers.length ; i++) {
                this.finalBooklet.vouchers[i] = this.checkedVouchers[i].querySelector('.booklet__voucher-image').getAttribute('data-src');
            }


            if (this.checkedVouchers.length === this.maxVouchers) {

                for (const item of this.uncheckedVouchers) {
                    item.style.opacity = '0.5';
                    item.querySelector('.mat-checkbox-inner-container').style.display = 'none';
                    item.querySelector('.mat-checkbox-inner-container').querySelector('.mat-checkbox-input').disabled = true;
                }
            } else {
                for (const item of this.uncheckedVouchers) {
                    item.style.opacity = '1';
                    item.querySelector('.mat-checkbox-inner-container').style.display = 'block';
                    item.querySelector('.mat-checkbox-inner-container').querySelector('.mat-checkbox-input').disabled = false;
                }
            }
        }, 450);

    }

    setCover() {
        if (this.recipient !== '') {
            this.nameEmpty = false;
        }

        this.profanityCheckTo = this.profanityService.check(this.recipient);
        this.selectedSlide = document.querySelector('.swiper-slide-active').querySelector('.booklet__cover-image');
        this.finalBooklet.cover = (this.selectedSlide.getAttribute('src'));
    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {

        if (tabChangeEvent.index === 3) {
            const image = new Image();
            const wideY = 48;

            image.onload = () => {

                this.canvas = document.getElementById('iou__canvas');
                this.canvas.width = 896;
                this.canvas.height = 398;
                this.ctx = this.canvas.getContext('2d');

                this.canvas2 = document.getElementById('iou__canvas2');
                this.canvas2.width = 1200;
                this.canvas2.height = 630;
                this.ctx2 = this.canvas2.getContext('2d');

                // Set font
                this.ctx.font = '34px GalanoGrotesque-Bold';
                this.ctx2.font = '34px GalanoGrotesque-Bold';

                // Draw the image
                this.ctx.drawImage(image, 0, 0);
                this.ctx.textAlign = 'center';
                this.ctx.fillStyle = 'white';

                this.ctx2.fillStyle = 'white';
                this.ctx2.textAlign = 'center';
                this.ctx2.fillRect(0, 0, this.canvas2.width, this.canvas2.height);
                this.ctx2.drawImage(image, 0, wideY , this.canvas2.width, (this.canvas2.height - (wideY * 2)));

                // Set constants
                const textPadding = 50;
                const topPosition = 12;

                // Calculate the text width with padding
                const textWidth = (this.ctx.measureText(this.recipient).width) + textPadding;
                const textWidth2 = (this.ctx2.measureText(this.recipient).width) + textPadding;

                // Calculate the text position relative to the center of the canvas
                const textBackgroundPosition = {
                    x: topPosition,
                    y: ( this.canvas.width / 2 ) - ( textWidth / 2 )
                };

                const textBackgroundPosition2 = {
                    x: ( topPosition + wideY + 10),
                    y: ( this.canvas2.width / 2 ) - ( textWidth / 2 )
                };

                // Draw the text background
                this.ctx.fillStyle = this.selectedSlide.getAttribute('data-color');
                this.roundedRectangle(
                    this.ctx,
                    textBackgroundPosition.y,
                    textBackgroundPosition.x,
                    textWidth,
                    50,
                    10,
                    true,
                    false
                );

                this.ctx2.fillStyle = this.selectedSlide.getAttribute('data-color');
                this.roundedRectangle(
                    this.ctx2,
                    textBackgroundPosition2.y,
                    textBackgroundPosition2.x,
                    textWidth,
                    50,
                    10,
                    true,
                    false
                );

                // Write the text
                this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                this.ctx.fillText(this.recipient, this.canvas.width / 2, 48);

                this.ctx2.fillStyle = 'rgba(255, 255, 255, 1)';
                this.ctx2.fillText(this.recipient, this.canvas2.width / 2, 106);

                this.saveResult();

            };

            image.src = this.selectedSlide.getAttribute('src');
        }
        this.selectedTab = tabChangeEvent.index;
    }

    /**
     * Material tab has been changed
     * @param n The current tab index
     */
    changeTab(n) {

        this.selectedTab = n;
    }

    /**
     * Saves the current result via the API
     */
    saveResult() {
        this.finalBooklet.name = this.recipient;
        this.finalBooklet.color = this.selectedSlide.getAttribute('data-color');
        this.finalBooklet.nid = this.contentId;

        this.showLoader();

        // Set the result_image from cavnas data
        this.canvas = document.getElementById('iou__canvas');
        const coverImageData = this.canvas.toDataURL('image/jpeg');
        const facebookImageData = this.canvas2.toDataURL('image/jpeg');

        const saveMeta = this.finalBooklet;
        saveMeta['result_image'] = coverImageData;
        saveMeta['result_image_facebook'] = facebookImageData;

        this.contentService.saveResult({
            type: 'ps_option_iou',
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
        () => {
            this.hideLoader();
        });
    }

   /**
    * Draws a rounded corner rectangle
    * @param {CanvasRenderingContext2D} ctx
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate
    * @param {Number} width The width of the rectangle
    * @param {Number} height The height of the rectangle
    * @param {Number} [radius = 5] The corner radius; It can also be an object to specify different radii for corners
    * @param {Number} [radius.tl = 0] Top left
    * @param {Number} [radius.tr = 0] Top right
    * @param {Number} [radius.br = 0] Bottom right
    * @param {Number} [radius.bl = 0] Bottom left
    * @param {Boolean} [fill = false] Whether to fill the rectangle.
    * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
    **/
    roundedRectangle( ctx, x, y, width, height, radius, fill, stroke ) {

        if (typeof stroke == 'undefined') {
            stroke = true;
        }

        if (typeof radius === 'undefined') {
            radius = 5;
        }

        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (const side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }

        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();

        if (fill) {
            ctx.fill();
        }

        if (stroke) {
            ctx.stroke();
        }

    }

    downloadPDF() {
        this.pdfService.generate(
            this.finalBooklet,
            this.canvas
        );
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

}
