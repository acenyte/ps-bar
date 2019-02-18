import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content/content.service';
import * as download from 'downloadjs';


@Component({
    selector: 'ps-gif',
    templateUrl: './gif.component.html',
    styleUrls: ['./gif.component.scss']
})
export class GifComponent implements OnInit {

    contentId: number;
    gif: any;

    constructor(
        private contentService: ContentService,
        private route: ActivatedRoute
    ) { }

    /**
     * Component init
     */
    ngOnInit() {
        window.scrollTo(0,0);
        this.route.params.subscribe(params => {
            this.contentId = parseInt(params['nid']);
            this.contentService.getContent().subscribe( (data: Response) => {
                this.gif = this.getItem(data);
            });
        });

    }

    /**
     * Find the API response for the current option by the nid
     * @param data JSON response from the web service
     */
    getItem(data) {

        return data.options.find((item) => {
            return parseInt(item.nid) === this.contentId && item.type === 'ps_option_gif';
        });

    }

    downloadFile() {
        download(this.gif.images.original);
    }
}
