import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class SongService {

    constructor() { }

    config: any =  {
        background : {
            height: 170,
        },
        text: {
            color: '#FFF',
            sizes: {
                small: 32,
                medium: 44,
                large: 55,
            },
            padding: {
                all: 24,
            }
        },
        offset: 57,
    };

    /**
     * Draws the album cover with the provided properties
     * @param data The data properties used to create the image (cover, song, to, artist, songName, color)
     * @param ctx The canvas context to draw
     */
    generateCover(data, ctx, callback) {

        console.table(data);

        const image = new Image();

        image.onload = () => {

            // Draw the background image
            ctx.drawImage(image, 0, 0 , 1000, 1000);

            // Draw the to text
            ctx.font = this.config.text.sizes.medium + 'px BowlbyOne-Regular';
            const toTextSize = ctx.measureText('TO: ' + data.to.toUpperCase());
            const toTextBounds = {
                width : toTextSize.width + (this.config.text.padding.all * 2),
                height: this.config.text.sizes.medium + (this.config.text.padding.all * 2),
            };

            ctx.fillStyle = "rgba(" + data.color + ")";
            ctx.fillRect(this.config.offset, 134, toTextBounds.width, toTextBounds.height);

            ctx.textAlign = 'left';
            ctx.fillStyle = this.config.text.color;
            ctx.fillText('TO: ' + data.to.toUpperCase(),
                            this.config.offset + (this.config.text.padding.all), 134 + (this.config.text.padding.all) + 36);

            // Song name
            ctx.fillStyle = "rgba(" + data.color + ")";
            ctx.font = this.config.text.sizes.large + 'px BowlbyOne-Regular';
            ctx.fillRect(this.config.offset, 240, 1000 - (this.config.offset * 2),
                        this.config.text.sizes.large + (this.config.text.padding.all * 2) + 36 );

            ctx.textAlign = 'center';
            ctx.fillStyle = this.config.text.color;
            ctx.fillText(data.songName.toUpperCase(), 1000 / 2, 240 + (this.config.text.padding.all) + 70);


            // Draw the artists
            ctx.font = this.config.text.sizes.small + 'px BowlbyOne-Regular';
            const artistTextSize = ctx.measureText('WRITTEN BY: ' + data.artist.toUpperCase());
            const artistTextBounds = {
                width : artistTextSize.width + (this.config.text.padding.all * 2),
                height: this.config.text.sizes.small + (this.config.text.padding.all * 2),
            };

            ctx.fillStyle = "rgba(" + data.color + ")";
            ctx.fillRect(this.config.offset,
                        1000 - this.config.offset - artistTextBounds.height, artistTextBounds.width, artistTextBounds.height);

            ctx.textAlign = 'left';
            ctx.fillStyle = this.config.text.color;
            ctx.fillText(
                'WRITTEN BY: ' + data.artist.toUpperCase(),
                this.config.offset + this.config.text.padding.all,
                1000 - this.config.offset - (this.config.text.padding.all) - 4
            );


            // Execute the callback
            callback();
        };

        image.src = data.cover;
    }

}

