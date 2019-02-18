import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    downloadFileName = 'PS IOU Booklet';

    metaImagePath = 'assets/images/meta.jpg';
    constructor() { }

    /**
     * Generates the PDF document using the supplied data
     */
    generate(data, canvas) {

        const doc = new jsPDF('l', 'mm', [66, 150]);
        const coverImage = new Image();

        const voucherWidth = 150;
        const voucherHeight = 66;
        const topMargin  = 0;
        const leftMargin  = 0;

        coverImage.onload = () => {
            doc.addImage(canvas.toDataURL(), 'JPEG', leftMargin, topMargin, voucherWidth, voucherHeight );

            const voucherImage = [];

            for ( let v = 0; v < data.vouchers.length; v++ ) {
                voucherImage[v] = new Image();
                voucherImage[v].onload = () => {
                    doc.addPage();
                    doc.addImage(voucherImage[v], 'JPEG', leftMargin, topMargin, voucherWidth, voucherHeight );

                    if ( v === data.vouchers.length - 1 ) {
                        doc.save( this.downloadFileName + '.pdf');
                    }
                };
                voucherImage[v].src = data.vouchers[v];
            }

        };

        coverImage.src = data.cover;

    }

}
