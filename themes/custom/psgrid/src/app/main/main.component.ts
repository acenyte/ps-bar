
import {
    Component,
    OnInit,
    ViewEncapsulation,
    Input,
    OnChanges,
    OnDestroy,
    AfterViewInit

} from '@angular/core';

import { Subscription } from 'rxjs';

import {
    HttpClient
} from '@angular/common/http';

import Isotope from 'isotope-layout';

import { MatDialog } from '@angular/material';
import { IntroComponent } from '../intro/intro.component';

import { MessagingService } from '../../services/messaging/messaging';
import { ContentService } from '../../services/content/content.service';

import { IContentCategories } from '../../interfaces/categories.interface';
import { IOption } from '../../interfaces/option.interface';
import { IResult } from '../../interfaces/result.interface';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'ps-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MainComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    contentCategories: IContentCategories[];
    options: IOption[];
    iso: any;
    gridFilterClasses: string[];
    content: any;
    message: any = {};
    subscription: Subscription;
    gridClass: any;
    introContainer: any;
    dialogRef: any;
    filterList = [
        'thanks',
        'iloveyou',
        'besties',
        'imsorry',
        'justbestrong',
        'winning',
        'happybday',
        'bighugs',
        'yourawesome',
        'bemybae'
    ];

    @Input() selectedFilter: string;

    // Drupal types class modifiers
    typeToClass = {
        'ps_option_relationship' : 'grid__item--width2 grid__item--height2',
        'ps_option_bar' : 'grid__item--width2',
        'ps_option_iou' : 'grid__item--width2 grid__item--height2',
        'ps_option_personalised' : 'grid__item--width2 grid__item--height2',
        'ps_option_gif' : '',
        'ps_option_valentines_competition' : 'grid__item--width2 grid__item--height2',
        'ps_option_valentines_song' : 'grid__item--width2 grid__item--height2',
    };

    // URL
    typeToURL = {
        'ps_option_relationship' : 'relationship-tip',
        'ps_option_bar' : 'bar',
        'ps_option_iou' : 'iou',
        'ps_option_personalised' : 'personalised',
        'ps_option_gif' : 'gif',
        'ps_option_valentines_competition' : 'mzansi-love-songs',
        'ps_option_valentines_song' : 'share-mzansi-songs',
    };

    constructor(
        private messagingService: MessagingService,
        private contentService: ContentService,
        private http: HttpClient,
        public dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        this.subscription = this.messagingService.getMessage().subscribe(message => {
            this.selectedFilter = message.data;
            this.filterGrid();
        });
    }

    ngOnInit() {
        window.scrollTo( 0, 0);
        document.getElementById('loader').style.display = 'inline-block';

        this.contentService.getContent().subscribe( (data: Response) => {
            this.initImageGrid(data);
        });

        if ( !this.checkIntroViewed() ) {
            this.setIntroViewed();
            this.openIntro();

        }

        this.contentCategories = [];
        this.options = [];
        this.gridFilterClasses = [];

    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    /**
     * Make a request to the getContent API and set the categories and options
     * Inits the grid
     */
    initImageGrid(data) {

        this.contentCategories = data.categories;
        this.options = data.options;

        this.options.map( (option) => {

            option.style = '';

            if ( option.type == "ps_option_valentines_competition" || option.type == "ps_option_valentines_song" ){
                option.url = `ps/${this.typeToURL[option.type]}`;
            } else {
                option.url = `ps/${this.typeToURL[option.type]}/${option.nid}`;
            }
            
            option.gridClass = this.typeToClass[option.type];

            option.category.map((category) => {
                option.style += `filter-tid-${category.tid} `;
            });

        });

        this.initGrid();
    }

    /**
     * Returns generated the sort order of the iso grid
     */
    getSortOrder() {
        const bigblockRangeEnd = 20;
        let order = [];

        // Create the initial array
        this.options.forEach(option => {
            if (
                option.type != 'ps_option_relationship' &&
                option.type != 'ps_option_personalised' &&
                option.type != 'ps_option_iou' &&
                option.type != 'ps_option_valentines_competition' &&
                option.type != 'ps_option_valentines_song'
            ) {
                order.push(option.nid);
            }
        });

        // Shuffle the array
        order = this.shuffleOptions(order);

        // Push the big blocks
        let bigBlocks = this.options.filter( option =>
            option.type == "ps_option_relationship" ||
            option.type == "ps_option_personalised" ||
            option.type == "ps_option_iou" ||
            option.type == "ps_option_valentines_competition" ||
            option.type == "ps_option_valentines_song"
        );

        bigBlocks.forEach(bigBlock => {
            let position = Math.floor(Math.random() * bigblockRangeEnd) + 0;
            order.splice(position, 0, bigBlock.nid);
        });

        return order;
    }

    /**
     * Shuffles the options array
     */
    shuffleOptions(options) {
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return options;
    }

    /**
     * Inits the isotope grid
     */
    initGrid() {
        document.getElementById('loader').style.display = 'none';
        // Shuffle the array
        let orders;

        if ( window['__shuffleOrder'] ) {
            orders = window['__shuffleOrder'];
        } else {
            orders = this.getSortOrder();
            window['__shuffleOrder'] = orders;
        }

        this.options.forEach(option => {
            // Find this options order property from our order array
            option['order'] = orders.findIndex( item => item === option.nid );
        });


        setTimeout(() => {
            const isoGrid = document.querySelector('.grid');
            this.iso = new Isotope(isoGrid, {
                itemSelector: '.grid__item',
                layoutMode: 'masonry',
                masonry: {
                    gutter: 4,
                    columnWidth: 100,
                    fitWidth: true
                },
                getSortData: {
                    orderBy: function(item) {
                        return parseInt(item.getAttribute('data-order'));
                    }
                },
                sortBy: 'orderBy',
            });

            this.iso.arrange({ sortBy: 'orderBy' });
            this.filterByFragment();
        }, 40);

    }

    /**
     * Update the grid on filter
     */
    ngOnChanges() {

        this.filterGrid ();

    }


    openIntro() {
        this.dialogRef = this.dialog.open(IntroComponent);
    }

    filterGrid () {

        if (this.iso) {

            if (this.selectedFilter === undefined ) {
                this.iso.arrange({ filter: '.grid__item' });
            } else {
                this.iso.arrange({ filter: '.' + this.selectedFilter });
            }


        }

    }

    /**
     * Checks if the intro has been viewed
     */
    checkIntroViewed() {
        return localStorage.getItem('introViewed') !== null;
    }

    /**
     * Sets the intro has been viewed
     */
    setIntroViewed() {
        localStorage.setItem('introViewed', '1');
    }

    filterByFragment() {
        const __this = this;

        this.route.fragment.subscribe((fragment: string) => {

            this.filterList.forEach(function(val, index) {
                if ( fragment === val) {
                    __this.iso.arrange({ filter: '.filter-tid-' + (index + 1) });
                }
             });
        });
    }

}




