import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewChecked } from '@angular/core';
import { IOption } from '../../interfaces/option.interface';
import { SwiperComponent } from 'ngx-useful-swiper';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content/content.service';
import { observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'ps-chocolate-bar',
    templateUrl: './chocolate-bar.component.html',
    styleUrls: ['./chocolate-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChocolateBarComponent implements OnInit, AfterViewChecked {

    options: IOption[];
    contentId: number;
    swiperOrder: any = {};
    swiperData: any;

    @ViewChild('barSwiper') barSwiper: SwiperComponent;

    configBar: any = {
        effect: 'fade',
        init: false,
        autoHeight: true,
        calculateHeight: true,
        preloadImages: true,
        updateOnImagesReady: true,
        slidesPerView: 1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        loop: true,
        fadeEffect: {
            crossFade: true
        },
        grabCursor: true
    };

    constructor(
        private contentService: ContentService,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        window.scrollTo(0,0);

        this.options = [];
        this.swiperData = '';

        this.route.params.subscribe(params => {
            this.contentId = params['nid'];

            this.contentService.getContent().subscribe((data: Response) => {
                this.initSlides(data);

                let i = 0;
                this.options.forEach(option => {
                    this.swiperData += `
                        <div class="swiper-slide">
                            <div class="chocolate-bar__slide" style="background-image:url(${option['background_images']['original']})">

                                <img class="chocolate-bar__headline" src="${option['headline_images']['original']}">
                                <img class="chocolate-bar__image" src="${option['bar_images']['original']}">
                                <p class="chocolate-bar__text text" style="color:${option['description_color']}">
                                    ${option['description']}
                                </p>

                            </div>

                        </div>
                    `;
                    i++;
                });

                this.swiperData = this.domSanitizer.bypassSecurityTrustHtml(this.swiperData);
                setTimeout( () => {
                    this.barSwiper.swiper.init();
                    this.barSwiper.swiper.slideTo(this.swiperOrder[this.contentId] + 1);
                }, 50);

            });
        });

    }

    ngAfterViewChecked() {
        this.barSwiper.swiper.update();
    }

    initSlides(data) {
        this.options = data.options.filter(option => option.type === 'ps_option_bar');

        let i = 0;
        this.options.forEach(item => {
            this.swiperOrder[item.nid] = i;
            i++;
        });
    }

}
