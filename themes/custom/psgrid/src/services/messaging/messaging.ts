import {
	Injectable
} from '@angular/core';

import {
	Observable,
	Subject
} from 'rxjs';

@Injectable()

export class MessagingService {

	private subject = new Subject<any>();

	sendMessage(data: string) {
		this.subject.next({ data: data });
	}

	clearMessage() {
		this.subject.next();
	}

	getMessage(): Observable<any> {
		return this.subject.asObservable();
	}

}
