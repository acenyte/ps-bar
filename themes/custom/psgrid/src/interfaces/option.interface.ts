// import { Url } from 'url';

export interface IOption {

    id?: number;
    nid: number;
    type: string;
    category: any[];
    style?: string;
    url?: string;
    gridClass?: string;
    images: {
    url?: string;
        thumbnail: string;
        original: string;
    };

}
