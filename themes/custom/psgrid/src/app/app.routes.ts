
import {
    RouterModule,
    Routes
} from '@angular/router';

import { ContentSharerComponent } from './content-sharer/content-sharer.component';
import { MainComponent } from './main/main.component';
import { BookletComponent } from './booklet/booklet.component';
import { ChocolateBarComponent } from './chocolate-bar/chocolate-bar.component';
import { ResultComponent } from './result/result.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { GifComponent } from './gif/gif.component';
import { ValentineLyricsComponent } from './valentine-lyrics/valentine-lyrics.component';
import { SongSharerComponent } from './song-sharer/song-sharer.component';
import { SongResultComponent } from './song-result/song-result.component';
import { ValentinesTermsComponent } from './valentines-terms/valentines-terms.component';



const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: MainComponent
    },
    {
        path: 'node',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'ps/iou/:nid',
        pathMatch: 'full',
        component: BookletComponent
    },
    {
        path: 'ps/bar/:nid',
        pathMatch: 'full',
        component: ChocolateBarComponent
    },
    {
        path: 'ps/share-mzansi-songs',
        pathMatch: 'full',
        component: SongSharerComponent
    },
    {
        path: 'ps/gif/:nid',
        pathMatch: 'full',
        component: GifComponent
    },
    {
        path: 'ps/:type/:nid',
        pathMatch: 'full',
        component: ContentSharerComponent
    },
    {
        path: 'ps/song-result/:nid/:token',
        pathMatch: 'full',
        component: SongResultComponent
    },
    {
        path: 'ps/result/:nid/:token',
        pathMatch: 'full',
        component: ResultComponent
    },
    {
        path: 'ps/privacy-policy',
        pathMatch: 'full',
        component: PrivacyComponent
    },
    {
        path: 'ps/cookie-policy',
        pathMatch: 'full',
        component: CookiePolicyComponent
    },
    {
        path: 'ps/terms-and-conditions-mzansi-love-songs',
        pathMatch: 'full',
        component: ValentinesTermsComponent
    },
    {
        path: 'ps/terms-and-conditions',
        pathMatch: 'full',
        component: TermsComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export const routerConfig: any = RouterModule.forRoot(routes, {
    enableTracing: false
});
