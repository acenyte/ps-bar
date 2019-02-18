import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { ProfanityService } from '../../services/profanity/profanity.service';
import { MatTabGroup } from '@angular/material';
import { MatTabChangeEvent } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ContentService } from '../../services/content/content.service';
import { SwiperComponent } from 'ngx-useful-swiper';
import { IValentineMessage } from '../../interfaces/valentines.interface';

@Component({
  selector: 'ps-valentine-lyrics',
  templateUrl: './valentine-lyrics.component.html',
  styleUrls: ['./valentine-lyrics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValentineLyricsComponent implements OnInit, AfterViewInit {

    constructor(
        private contentService: ContentService,
        private profanityService: ProfanityService
    ) { }

    signedIn = false;
    profanityCheckTitle: boolean;
    profanityCheckName: boolean;
    profanityCheckTo: boolean;
    lyricsValid = false;
    formValid = false;
    lyricsCharacterMax = 350;
    lyricsCharactersLeft = this.lyricsCharacterMax;
    selectedTab = 0;
    termsChecked = false;
    ageChecked = false;
    isSubmitting = false;
    hasSubmitted = false;

    TAB_SUCCESS = 3;
    TAB_MAX_ENTRIES = 4;

    @ViewChild('tabGroup') tabGroup: MatTabGroup;

    entry: {
        lyrics: string,
        to: string;
        name: string,
        message: number,
        song_name: string,
        entry_name: string
        entry_email: string,
        entry_mobile: string,
        entry_terms: number;

    };

    valentineMessages: IValentineMessage[];
    selectedLanguageId: number;
    selectedImage: string;

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    mobileFormControl = new FormControl('', [
        Validators.required,
        Validators.pattern('^[0][0-9]*$'),
    ]);

    ngOnInit() {

        window.scrollTo( 0, 0);
        this.entry = {
            lyrics: '',
            to: '',
            name: '',
            message: 0,
            song_name: '',
            entry_name: '',
            entry_email: '',
            entry_mobile: '',
            entry_terms: 0
        };

        this.valentineMessages = [];

        this.contentService.getValentinesContent().subscribe( (data: Response) => {
            this.setMessages(data);

            // Set the default selection
            if ( this.valentineMessages.length > 0 ) {
                this.selectedImage = this.valentineMessages[0].image;
                //this.selectedLanguageId = this.valentineMessages[0].nid;
                this.entry.message = this.selectedLanguageId;
            }

        });
    }

    ngAfterViewInit() {
        window.scrollTo( 0, 0);
    }

    setMessages(data) {

        data.messages.forEach( (message, index) => {
            this.valentineMessages.push({
                nid: message.nid,
                text: message.title,
                image: message.cover
            });
        });

    }

    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {

        if (this.selectedTab === 1) {
            if (this.hasSubmitted === true) {
                const titleInput = <HTMLInputElement>document.getElementById('title-input') ;
                const toInput = <HTMLInputElement>document.getElementById('to-input') ;
                const lyricsInput = <HTMLInputElement>document.getElementById('lyrics-input') ;

                lyricsInput.value = '';
                toInput.value = '';
                titleInput.value = '';

                this.entry.lyrics = '';
                this.entry.song_name = '';
                this.entry.to = '';
            }
        }

        if (this.selectedTab === 2) {
            this.setPatternFilter('mobile-input', /^-?\d*$/);
        }
        window.scrollTo( 0, 0);
    }

    validateForm() {
        const nameInput = <HTMLInputElement>document.getElementById('name-input') ;
        const emailInput = <HTMLInputElement>document.getElementById('email-input') ;
        const mobileInput = <HTMLInputElement>document.getElementById('mobile-input') ;


        if (nameInput.value.length < 1 ) {
            document.getElementsByClassName('error')[0].innerHTML = 'Please enter your name';
        } else {
            document.getElementsByClassName('error')[0].innerHTML = '';
        }

        if (this.emailFormControl.hasError('required')) {
            document.getElementsByClassName('error')[1].innerHTML = 'Please enter your email';
        } else if (this.emailFormControl.hasError('email')) {
            document.getElementsByClassName('error')[1].innerHTML = 'Invalid email address';
        } else {
            document.getElementsByClassName('error')[1].innerHTML = '';
        }

        if (this.mobileFormControl.hasError('required')) {
            document.getElementsByClassName('error')[2].innerHTML = 'Please enter your mobile number';
        } else if (this.mobileFormControl.hasError('pattern')) {
            document.getElementsByClassName('error')[2].innerHTML = 'Invalid mobile number';
        } else if (this.mobileFormControl.hasError('minlength')) {
            document.getElementsByClassName('error')[2].innerHTML = 'Mobile number should have 10 digits';
        }  else {
            document.getElementsByClassName('error')[2].innerHTML = '';
        }

        if (this.termsChecked &&
            this.emailFormControl.valid &&
            this.mobileFormControl.valid &&
            nameInput.value.length > 0
        ) {
            this.entry.name = nameInput.value;
            this.entry.entry_name = nameInput.value;
            this.entry.entry_email = emailInput.value;
            this.entry.entry_mobile = mobileInput.value;
            this.entry.entry_terms = 1;
            this.formValid = true;
        }

        // Make sure the terms checbox is checked
        if ( !this.termsChecked ) {
            this.formValid = false;
        }

    }

    validateLyrics(x) {
        const titleInput = <HTMLInputElement>document.getElementById('title-input') ;
        const toInput = <HTMLInputElement>document.getElementById('to-input') ;
        const lyricsInput = <HTMLInputElement>document.getElementById('lyrics-input') ;

        this.profanityCheckTo = this.profanityService.check(toInput.value);
        this.profanityCheckTitle = this.profanityService.check(titleInput.value);
        this.lyricsCharactersLeft = this.lyricsCharacterMax - (lyricsInput.value.length);

        switch (x) {
            case 1 :
                if ( titleInput.value.length < 1 ) {
                    document.getElementsByClassName('error-message')[0].innerHTML = 'Invalid Title';
                } else if (this.profanityCheckTitle ) {
                    document.getElementsByClassName('error-message')[0].innerHTML = 'Please refrain from using profanity';
                } else {
                    document.getElementsByClassName('error-message')[0].innerHTML = '';
                    this.entry.song_name = titleInput.value;
                }
                break;
            case 2 :
                if ( lyricsInput.value.length < 100 ) {
                    document.getElementsByClassName('error-message')[2].innerHTML = 'Please enter at least 100 characters';
                } else {
                    document.getElementsByClassName('error-message')[2].innerHTML = '';
                    this.entry.lyrics = lyricsInput.value;
                }
                break;
            case 3 :
                if ( this.profanityCheckTo ) {
                    document.getElementsByClassName('error-message')[1].innerHTML = 'Please refrain from using profanity';
                } else {
                    document.getElementsByClassName('error-message')[1].innerHTML = '';
                    this.entry.to = toInput.value;
                }
        }

        if (titleInput.value.length > 1 &&
            !this.profanityCheckTitle &&
            !this.profanityCheckName &&
            this.lyricsCharactersLeft < 251 &&
            this.selectedLanguageId ) {
            this.lyricsValid = true;
        } else {
            this.lyricsValid = false;
        }

    }

    changeTab(n) {
        this.selectedTab = n;
    }

    /**
     * Creates a new entry
     */
    createEntry() {

        // Prevent multiple submits
        if ( !this.isSubmitting ) {

            this.isSubmitting = true;

            this.contentService.createValentinesEntry(
                this.entry,
            ).subscribe( (response) => {
                this.isSubmitting = false;
                this.hasSubmitted = true;

                if ( response['success'] ) {
                    this.selectedTab = this.TAB_SUCCESS;
                } else {

                    if ( response['errors'].includes("MAX_ENTRIES") ){
                        this.selectedTab = this.TAB_MAX_ENTRIES;
                    } else {
                        // General API error
                        // TODO: Display a message
                        console.log("validation error:", response['errors']);
                    }

                }

            });

        }

    }

    changeLanguage() {
        const chosenMessage = this.valentineMessages.filter(
            message => message['nid'] === this.selectedLanguageId
        );
        this.validateLyrics(0);
        this.entry.message = this.selectedLanguageId;
        this.selectedImage = chosenMessage[0].image;
    }

    setPatternFilter(id, pattern) {
        this.setInputFilter(document.getElementById(id), function(value) { return pattern.test(value); });
    }

    setInputFilter(textbox, inputFilter) {
        ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(function(event) {
            textbox.addEventListener(event, function() {
                if (inputFilter(this.value)) {
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty('oldValue')) {
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                }
            });
        });
    }

}
