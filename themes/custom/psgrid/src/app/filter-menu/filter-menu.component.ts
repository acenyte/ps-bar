import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { MessagingService } from '../../services/messaging/messaging';

import { ContentService } from '../../services/content/content.service';

import { IContentCategories } from '../../interfaces/categories.interface';

import { IntroComponent } from '../intro/intro.component';

import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'ps-filter-menu',
	templateUrl: './filter-menu.component.html',
	styleUrls: ['./filter-menu.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class FilterMenuComponent implements OnInit {

	selectedFilter: string;
	filters: IContentCategories[];
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

	constructor(
        public router: Router,
        private messagingService: MessagingService,
        private contentService: ContentService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
	) {}

	ngOnInit() {

        this.filters = [];
        this.contentService.getContent().subscribe( (data: Response) => {
            this.initFilters(data);
        });
        this.filterByFragment();

	}

	sendFilter () {
        this.messagingService.sendMessage(this.selectedFilter);
    }

    openIntro() {
        this.dialogRef = this.dialog.open(IntroComponent, { width: '100vw'});
    }

	/**
	 * Make a request to the getContent API and set the filter labels
	 */
	initFilters(data) {
        this.filters = data.categories;

        this.filters.map( (filter) => {
            filter.filterId = `filter-tid-${filter.tid}`;
            filter.color = `${filter.color}`;
            filter.tid = filter.tid;
        });

    }

    fadeInElement() {
        this.introContainer = document.querySelector('.intro');
        this.introContainer.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        this.introContainer.style.display = 'block';
    }

    filterByFragment() {
        const __this = this;
        this.route.fragment.subscribe((fragment: string) => {
            this.filterList.forEach(function(val, index) {
                if ( fragment === val) {
                    __this.selectedFilter = ('filter-tid-' + (index + 1));

                }
             });
        });
    }

    checkFilter(x) {
        if (this.router.url !== '/') {
            if (x == this.selectedFilter) {
                return true;
            }
        } else if (this.router.url == '/' && x === 'all') {
            return true;
        } else {
            return false;
        }
    }

}

