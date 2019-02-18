import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessagingService } from '../../services/messaging/messaging';

@Component({
	selector: 'ps-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

	constructor(
        private messagingService: MessagingService
    ) { }

	ngOnInit() {

    }

    sendFilter () {
        this.messagingService.sendMessage(undefined);
    }

}
