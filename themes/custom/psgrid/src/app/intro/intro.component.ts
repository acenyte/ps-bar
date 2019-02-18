import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    ViewChild,
    OnDestroy
} from '@angular/core';

import {
    Router,
    ActivatedRoute
} from '@angular/router';


import { SwiperComponent } from 'ngx-useful-swiper';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'ps-intro',
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class IntroComponent implements OnInit, AfterViewInit, OnDestroy {


    introContainer: any;
    configIntro: any = {
        init: false,
        navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        },
        spaceBetween: 30,
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true,
        },
        grabCursor: true,
        autoHeight: true,
        calculateHeight: true,
        centeredSlides: true,
        slidesPerView: '1',
        preloadImages: true,
        updateOnImagesReady: true,
        direction: 'horizontal',
        observer: true,
        observeParents: true,
    };

    dialogRef: any;

    @ViewChild('usefulSwiper') usefulSwiper: SwiperComponent;

    constructor(
        private route: Router,
        public dialog: MatDialog,
    ) {}


    ngOnInit() {


        this.introContainer = document.querySelector('.intro');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        (document.getElementsByClassName('mat-dialog-container')[0] as HTMLInputElement).style.position = 'static';
        (document.getElementsByClassName('mat-dialog-container')[0] as HTMLInputElement).style.zIndex = '0';
        (document.getElementsByClassName('mat-dialog-container')[0] as HTMLInputElement).style.top = '0';
        (document.getElementsByClassName('mat-dialog-container')[0] as HTMLInputElement).style.left = '0';

    }

    ngAfterViewInit() {
        this.usefulSwiper.swiper.init();
        this.usefulSwiper.swiper.update();
        this.usefulSwiper.swiper.slideTo(0);
    }

    ngOnDestroy() {
        document.body.style.overflow = 'auto';
    }


    // fadeOutElement() {
    //     this.introContainer = document.querySelector('.intro');
    //     this.introContainer.classList.add('hide');
    //     document.body.style.overflow = 'auto';
    //     this.setIntroViewed();
    // }

    // hideElement() {
    //     this.introContainer = document.querySelector('.intro');
    //     this.introContainer.style.display = 'none';
    // }

}
