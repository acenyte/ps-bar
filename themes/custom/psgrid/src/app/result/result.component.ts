import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContentService } from '../../services/content/content.service';
import { PdfService } from '../../services/pdf/pdf.service';
import * as download from 'downloadjs';

@Component({
    selector: 'ps-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResultComponent implements OnInit {

    canvas:  any;
    ctx: any;
    finalBooklet: any;
    isIOU = false;
    resultImg: any;
    returnUrl: any;

    constructor(
        private contentService: ContentService,
        private activatedRoute: ActivatedRoute,
        private pdfService: PdfService
    ) { }

    ngOnInit() {
        // Get the result data from the web service
        window.scrollTo(0,0);
        
        this.activatedRoute.params.subscribe((params: Params) => {

            this.contentService.getResult(params['nid'], params['token'])
                .subscribe( (resp) => {
                    if ( resp['success'] ) {
                        switch ( resp['data']['type'] ) {
                            case 'personalised_item':
                                this.renderPersonalised(resp['data']);
                            break;

                            case 'ps_relationship_item':
                                this.renderRelationship(resp['data']);
                            break;

                            case 'ps_option_iou':
                                this.renderIou(resp['data']);
                                this.isIOU = true;
                            break;
                        }
                    }
                });
        });

        this.initCanvas();
    }

    /**
     * Init the canvas
     */
    initCanvas() {
        this.canvas = document.getElementById('result__canvas');
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Render the personalised content type
     */
    renderPersonalised(data) {
        const image = new Image();
        const meta = JSON.parse(data.meta);

        this.returnUrl = '/ps/personalised/' + meta.nid;

        image.onload = () => {
            setTimeout(() => {
                this.ctx.drawImage(image, 0, 0);

                this.ctx.fillStyle = meta.font.color;
                this.ctx.font = meta.font.name;
                this.ctx.shadowColor = 'black';
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                this.ctx.shadowBlur = 10;

                if (meta.fromName.value !== '') {
                    this.ctx.fillText('FROM: ' + meta.fromName.value, meta.fromName.x, meta.fromName.y);
                }
                if (meta.toName.value !== '') {
                    this.ctx.fillText('TO: ' + meta.toName.value, meta.toName.x, meta.toName.y);
                }
                this.resultImg = this.canvas.toDataURL('image/jpeg');
            }, 100);

        };

        const imageSRC = meta.image.replace(/\\\//g, '/');
        image.src = imageSRC;
    }

    /**
     * Renders the relationship content tyoe
     */
    renderRelationship(data) {
        const image = new Image();
        const meta = JSON.parse(data.meta);

        this.returnUrl = '/ps/relationship-tip/' + meta.nid;

        image.onload = () => {
            this.ctx.drawImage(image, 0, 0);
            this.resultImg = this.canvas.toDataURL('image/jpeg');
        };

        const imageSRC = meta.image.replace(/\\\//g, '/');
        image.src = imageSRC;
    }

    /**
     * Renders the IOU content type
     */
    renderIou(data) {
        this.canvas.classList.add('iou-canvas');

        const meta = JSON.parse(data.meta);
        this.finalBooklet = meta;

        this.returnUrl = '/ps/iou/' + meta.nid;

        const image = new Image();

        image.onload = () => {
            this.canvas.width = 896;
            this.canvas.height = 398;
            this.ctx = this.canvas.getContext('2d');

            // Set font
            this.ctx.font = '34px GalanoGrotesque-Bold';

            // Draw the image
            this.ctx.drawImage(image, 0, 0);
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'white';

            // Set constants
            const textPadding = 50;
            const topPosition = 12;

            // Calculate the text width with padding
            const textWidth = (this.ctx.measureText(meta.name).width) + textPadding;

            // Calculate the text position relative to the center of the canvas
            const textBackgroundPosition = {
                x: topPosition,
                y: ( this.canvas.width / 2 ) - ( textWidth / 2 )
            };

            // Draw the text background
            this.ctx.fillStyle = meta.color;
            this.roundedRectangle(
                this.ctx,
                textBackgroundPosition.y,
                textBackgroundPosition.x,
                textWidth,
                50,
                10,
                true,
                false
            );

            // Write the text
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.fillText(meta.name, this.canvas.width / 2, 48);

        };

        image.src = meta.cover;
    }

    /**
    * Draws a rounded corner rectangle
    * @param {CanvasRenderingContext2D} ctx
    * @param {Number} x The top left x coordinate
    * @param {Number} y The top left y coordinate
    * @param {Number} width The width of the rectangle
    * @param {Number} height The height of the rectangle
    * @param {Number} [radius = 5] The corner radius; It can also be an object to specify different radii for corners
    * @param {Number} [radius.tl = 0] Top left
    * @param {Number} [radius.tr = 0] Top right
    * @param {Number} [radius.br = 0] Bottom right
    * @param {Number} [radius.bl = 0] Bottom left
    * @param {Boolean} [fill = false] Whether to fill the rectangle.
    * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
    **/
   roundedRectangle( ctx, x, y, width, height, radius, fill, stroke ) {

        if (typeof stroke == 'undefined') {
            stroke = true;
        }

        if (typeof radius === 'undefined') {
            radius = 5;
        }

        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (const side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }

        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();

        if (fill) {
            ctx.fill();
        }

        if (stroke) {
            ctx.stroke();
        }

    }

    /**
     * Donwloads the PDF
     */
    downloadPdf() {

        this.pdfService.generate(
            this.finalBooklet,
            document.getElementById('result__canvas')
        );

        return false;
    }

    downloadFile(filename) {
        download(this.resultImg, filename, 'image/jpeg');
    }

}
