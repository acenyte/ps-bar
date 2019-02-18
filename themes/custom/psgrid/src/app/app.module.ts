import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import {
    MatSidenavModule,
    MatRadioModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { IntroComponent } from './intro/intro.component';
import { ContentSharerComponent } from './content-sharer/content-sharer.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routerConfig } from './app.routes';
import { MessagingService } from '../services/messaging/messaging';
import { ContentService } from '../services/content/content.service';
import { UserService } from '../services/user/user.service';

import { SwiperModule } from 'ngx-useful-swiper';
import { BookletComponent } from './booklet/booklet.component';
import { SortablejsModule } from 'angular-sortablejs/dist';

import { WebStorageModule } from 'ngx-store';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { ChocolateBarComponent } from './chocolate-bar/chocolate-bar.component';
import { ResultComponent } from './result/result.component';

import { ShareButtonModule } from '@ngx-share/button';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { GifComponent } from './gif/gif.component';
import { ValentineLyricsComponent } from './valentine-lyrics/valentine-lyrics.component';
import { SongSharerComponent } from './song-sharer/song-sharer.component';
import { SongResultComponent } from './song-result/song-result.component';
import { ValentinesTermsComponent } from './valentines-terms/valentines-terms.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		MainComponent,
		FilterMenuComponent,
		ContentSharerComponent,
		IntroComponent,
		BookletComponent,
		ProfileMenuComponent,
		ChocolateBarComponent,
        ResultComponent,
        LoginModalComponent,
        TermsComponent,
        PrivacyComponent,
        CookiePolicyComponent,
        GifComponent,
        ValentineLyricsComponent,
        SongSharerComponent,
        SongResultComponent,
        ValentinesTermsComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatSidenavModule,
		MatIconModule,
        MatRadioModule,
        MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		routerConfig,
		CommonModule,
		ScrollDispatchModule,
		HttpClientModule,
        SwiperModule,
        MatInputModule,
        MatSelectModule,
        MatTabsModule,
        WebStorageModule,
        MatCheckboxModule,
        MatDialogModule,
		SortablejsModule,
		ShareButtonModule.forRoot()
    ],
    entryComponents: [
        AppComponent,
        LoginModalComponent,
        IntroComponent],
	providers: [
        MessagingService,
        ContentService,
        UserService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
