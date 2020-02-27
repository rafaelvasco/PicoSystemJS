import ColorRgba from "./ColorRgba";
import { Dom } from "../utils/dom";

class PixelData {
    constructor(gfx) {
        this._g = gfx;
        this.imageData;
        this.buffer;
        this.buffer8;
        this.pixelBuffer;
        this._curSrcX;
        this._curSrcY;
    }

    get(srcX, srcY, srcW, srcH) {
        this._curSrcX = srcX;
        this._curSrcY = srcY;
        this.imageData = this._g.getImageData(srcX, srcY, srcW, srcH);
        this.pixelBuffer = new Uint32Array(this.imageData.data.buffer);
        return this.pixelBuffer;
    }

    put() {
        this._g.putImageData(this.imageData, this._curSrcX, this._curSrcY);
    }
}

export default class Pixmap {
    constructor(width, height) {
        this._canvas = null;
        this._gfx = null;
        this._dataUrl = null;
        this._canvas = Dom.create("canvas");
        this._canvas.width = width;
        this._canvas.height = height;
        this._gfx = this._canvas.getContext("2d", {
            alpha: true
        });
        this._pixelData = new PixelData(this._gfx);
        this._gfx.imageSmoothingEnabled = false;
    }

    free() {
        this._canvas = null;
        this._gfx = null;
    }

    get canvas() {
        return this._canvas;
    }

    get dataURL() {
        if (!this._dataUrl) {
            this._dataUrl = this._canvas.toDataURL();
        }
        return this._dataUrl;
    }

    get width() {
        return this._canvas.width;
    }
    get height() {
        return this._canvas.height;
    }

    /**
     * Create pixmap with given size
     * @param {*} width
     * @param {*} height
     */
    static create(width, height) {
        const pixmap = new Pixmap(width, height);
        return pixmap;
    }

    static createFromPixmap(pixmap) {
        const newPixmap = new Pixmap(pixmap.width, pixmap.height);
        newPixmap.drawBitmap(pixmap.canvas);
        return newPixmap;
    }

    /**
     * Create pixmap from a valid src, ex.: File, DataUrl etc.
     * @param {*} source
     */
    static createFromSource(source) {
        return new Promise(resolve => {
            const image = new Image();
            image.src = source;
            image.addEventListener("load", () => {
                const pixmap = new Pixmap(image.width, image.height);
                pix;
            });
        });
    }

    /**
     * Get ColorRgba value at given position
     * @param {*} x
     * @param {*} y
     */
    getColorAt(x, y) {
        const pixels = this._pixelData.get(x, y, 1, 1);
        const pixel = pixels[0];
        const color = new ColorRgba(
            (pixel >>> 0) & 0xff,
            (pixel >>> 8) & 0xff,
            (pixel >>> 16) & 0xff,
            (pixel >>> 24) & 0xff
        );
        return color;
    }

    _getIntColorAt(pixeldata, index) {
        const pixel = pixeldata[index];
        return  ((pixel >>> 0) & 0xff) |
                (((pixel >>> 8) & 0xff) << 8) |
                (((pixel >>> 16) & 0xff) << 16) |
                (((pixel >>> 24) & 0xff) << 24);
    }

    erase() {
        this._gfx.clearRect(0, 0, this.width, this.height);
    }

    eraseRect(x, y, w, h) {
        this._gfx.clearRect(x, y, w, h);
    }

    /**
     * Resizes the pixmap to given width and height,
     * anchoring content on given anchor values
     * @param {*} width
     * @param {*} height
     * @param {*} xAnchor
     * @param {*} yAnchor
     */
    resize(width, height, xAnchor, yAnchor) {}

    /**
     * Crops the Pixmap
     * @param {*} x
     * @param {*} y
     * @param {*} w
     * @param {*} h
     */
    crop(x, y, w, h) {
        this._pixelData.get(x, y, w, h);
        this._canvas.width = w;
        this._canvas.height = h;
        this._pixelData.put();
    }

    /**
     * Copies a portion of given region of the pixmap into a new Pixmap
     * and then erases the given region;
     * @param {*} x
     * @param {*} y
     * @param {*} w
     * @param {*} h
     */
    cut(x, y, w, h) {
        const regionImageData = this._gfx.getImageData(x, y, w, h);

        const newPixmap = Pixmap.create(w, h);

        newPixmap._gfx.putImageData(regionImageData, 0, 0);

        this.eraseRect(x, y, w, h);

        return newPixmap;
    }

    /**
     * Scales the pixmap by given factor
     * @param {*} scale
     */
    scale(scale) {
        const pw = this.width;
        const ph = this.height;
        const scaledW = pw * scale;
        const scaledH = ph * scale;

        const scaledPixmap = Pixmap.create(scaledW, scaledH);

        scaled.drawBitmap(this._canvas, w, h);

        this._canvas.width = scaledW;
        this._canvas.height = scaledH;

        this.drawBitmap(scaled._canvas);
    }

    /**
     * Mirrors the Pixmap pixels horizontally
     */
    mirrorHorizontal() {
        const pw = this.width;
        const ph = this.height;

        const data = this._pixelData.get(0, 0, pw, ph);
        for (let y = 0; y < ph; ++y) {
            for (let x = 0; x < pw; ++x) {
                let co = y * pw + (pw - x - 1);
                let ci = y * pw + x;
                data[ci] = data[co];
            }
        }
        this._pixelData.put();
    }

    /**
     * Mirrors Pixmap pixels vertically
     */
    mirrorVertical() {
        const pw = this.width;
        const ph = this.height;

        const data = this._pixelData.get(0, 0, pw, ph);
        for (let y = 0; y < ph; y++) {
            for (let x = 0; x < pw; x++) {
                let co = ((ph - y - 1) * pw + x) * 4;
                let ci = (y * pw + x) * 4;
                data[ci] = data[co];
            }
        }
        this._pixelData.put();
    }

    movePixels(dx, dy) {
        const imageData = this._gfx.getImageData(0, 0, this.width, this.height);
        this._gfx.clearRect(0, 0, this.width, this.height);
        this._gfx.putImageData(imageData, dx, dy);
    }

    /**
     * Fills a square with given size and ColorRgba
     * @param {*} x
     * @param {*} y
     * @param {*} size
     * @param {*} color
     */
    drawPoint(x, y, size, color) {
        const pw = this.width;
        const ph = this.height;
        const pd = this._pixelData;
        const rgba = color.rgba32;
        if (size === 1) {
            if (x < 0 || y < 0 || x >= pw || y >= ph) {
                return;
            }
            const data = pd.get(x, y, 1, 1);
            data[0] = rgba;
            pd.put(this._gfx);
            return;
        }
        const data = pd.get(x, y, size, size);
        const area = size * size;
        for (let i = 0; i < area; ++i) {
            data[i] = rgba;
        }
        pd.put();
    }

    /**
     * Strokes a rectangle with a given color, keeping proportions or not.
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     * @param {*} color
     * @param {*} size
     * @param {*} proportional
     */
    drawRect(x1, y1, x2, y2, color, size, proportional = false) {
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        const pw = this.width;
        const ph = this.height;

        if (size <= 0) {
            size = 1;
        }

        if (x1 > x2) {
            [x1, x2] = [x2, x1];

            if (proportional === true) {
                x1 = x2 - width;
            }
        } else if (proportional === true) {
            x2 = x1 + width;
        }

        if (y1 > y2) {
            [y1, y2] = [y2, y1];

            if (proportional === true) {
                y1 = y2 - height;
            }
        } else if (proportional === true) {
            y2 = y1 + height;
        }

        const data = this._pixelData.get(0, 0, pw, ph);
        const rgba = color.rgba32;

        if (size === 1) {
            for (let x = x1; x <= x1 + width; ++x) {
                const idx1 = x + y1 * pw;
                const idx2 = x + y2 * pw;
                data[idx1] = rgba;
                data[idx2] = rgba;
            }
            for (let y = y1; y < y1 + height; ++y) {
                const idx1 = x1 + y * pw;
                const idx2 = x2 + y * pw;
                data[idx1] = rgba;
                data[idx2] = rgba;
            }
        } else {
            const w = width + size - 1;
            for (let x = x1; x <= x1 + w; ++x) {
                for (let y = y1; y < y1 + size; ++y) {
                    const idx = x + y * pw;
                    data[idx] = rgba;
                }
                for (let y = y2; y < y2 + size; ++y) {
                    const idx = x + y * pw;
                    data[idx] = rgba;
                }
            }
            for (let y = y1; y <= y1 + height; ++y) {
                for (let x = x1; x < x1 + size; ++x) {
                    const idx = x + y * pw;
                    data[idx] = rgba;
                }
                for (let x = x2; x < x2 + size; ++x) {
                    const idx = x + y * pw;
                    data[idx] = rgba;
                }
            }
        }

        this._pixelData.put();
    }

    /**
     * Draws a line using Bresenham algorithm
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     * @param {*} size
     * @param {*} color
     */

    drawLine(x1, y1, x2, y2, size, color) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        let eps = 0;
        const sx = dx > 0 ? size : -size;
        const sy = dy > 0 ? size : -size;
        const pw = this.width;
        const ph = this.height;
        const pd = this._pixelData;
        const data = pd.get(0, 0, pw, ph);
        const rgba = color.rgba32;
        if (adx > ady) {
            for (let x = x1, y = y1; sx < 0 ? x >= x2 : x <= x2; x += sx) {
                for (let j = y; j < y + size; ++j) {
                    for (let i = x; i < x + size; ++i) {
                        const idx = i + j * pw;
                        data[idx] = rgba;
                    }
                }
                eps += ady;
                if (eps << 1 >= adx) {
                    y += sy;
                    eps -= adx;
                }
            }
        } else {
            for (let x = x1, y = y1; sy < 0 ? y >= y2 : y <= y2; y += sy) {
                for (let j = y; j < y + size; ++j) {
                    for (let i = x; i < x + size; ++i) {
                        const idx = i + j * pw;
                        data[idx] = rgba;
                    }
                }
                eps += adx;
                if (eps << 1 >= ady) {
                    x += sx;
                    eps -= ady;
                }
            }
        }

        pd.put();
    }

    /**
     * Draws a circle with given color, keeping proportions or not
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     * @param {*} color
     */
    drawCircle(x1, y1, x2, y2, color) {
        let width = Math.abs(x1 - x2);
        let height = Math.abs(y1 - y2);
        const pw = this.width;
        const ph = this.height;

        if (width < 1 || height < 1) return;

        const data = this._pixelData.get(0, 0, pw, ph);
        const rgba = color.rgba32;

        for (let x = 0; x <= width; ++x) {
            const xPerc = x / (width / 2) - 1;
            const yPerc = Math.sin(Math.acos(xPerc));
            const y = (yPerc * height) / 2;

            const idx1 =
                Math.round(x1 + x) + Math.round(y1 + height / 2 + y) * pw;
            const idx2 =
                Math.round(x1 + x) + Math.round(y1 + height / 2 - y) * pw;

            data[idx1] = rgba;
            data[idx2] = rgba;
        }

        for (let y = 0; y <= height; ++y) {
            const yPerc = y / (height / 2) - 1;
            const xPerc = Math.cos(Math.asin(yPerc));
            const x = (xPerc * width) / 2;

            const idx1 =
                Math.round(x1 + width / 2 + x) + Math.round(y1 + y) * pw;
            const idx2 =
                Math.round(x1 + width / 2 - x) + Math.round(y1 + y) * pw;

            data[idx1] = rgba;
            data[idx2] = rgba;
        }

        this._pixelData.put();
    }

    /**
     * Fills a rectangle area with the given ColorRgba using native canvas fillRect
     * function instead of pixel by pixel;
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     * @param {*} color
     * @param {*} proportional
     */
    fillRectNative(x1, y1, x2, y2, color, proportional = false) {
        // console.time("FillRect Native");
        const width = Math.abs(x1 - x2);
        const height = Math.abs(y1 - y2);

        if (x1 > x2) {
            [x1, x2] = [x2, x1];

            if (proportional === true) {
                x1 = x2 - width;
            }
        } else if (proportional === true) {
            x2 = x1 + width;
        }

        if (y1 > y2) {
            [y1, y2] = [y2, y1];

            if (proportional === true) {
                y1 = y2 - height;
            }
        } else if (proportional === true) {
            y2 = y1 + height;
        }

        this._gfx.fillStyle = color;
        this._gfx.fillRect(x1, y1, width, height);
        // console.timeEnd("FillRect Native");
    }

    /**
     * Fills a rectangle area with a given ColorRgba
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     * @param {*} color
     * @param {*} proportional
     */
    fillRect(x1, y1, x2, y2, color, proportional = false) {
        console.time("FillRect");
        const width = Math.abs(x1 - x2);
        const height = Math.abs(y1 - y2);

        if (x1 > x2) {
            [x1, x2] = [x2, x1];

            if (proportional === true) {
                x1 = x2 - width;
            }
        } else if (proportional === true) {
            x2 = x1 + width;
        }

        if (y1 > y2) {
            [y1, y2] = [y2, y1];

            if (proportional === true) {
                y1 = y2 - height;
            }
        } else if (proportional === true) {
            y2 = y1 + height;
        }

        const rw = x2 - x1;
        const rh = y2 - y1;
        const rgba = color.rgba32;

        const data = this._pixelData.get(x1, y1, rw, rh);

        for (let x = 0; x < rw; ++x) {
            for (let y = 0; y < rh; ++y) {
                data[x + y * rw] = rgba;
            }
        }
        this._pixelData.put();
        console.timeEnd("FillRect");
    }

    fill(x, y, color) {

        console.time("Fill");
        const pw = this.width;
        const ph = this.height;
        const data = this._pixelData.get(0, 0, pw, ph);
        const dataLength = data.length;
        let index = x + y * pw;
        let indexEast = index;
        let indexWest = index;
        let maxEast;
        let maxWest;
        const pickAt = this._getIntColorAt;
        const srcColor = pickAt(data, index);
        const dstColor = color.rgba32;

        if (srcColor === dstColor) {
            return;
        }

        let queue = [index];

        while(queue.length) {
            index = queue.pop();
            if (srcColor === pickAt(data, index)) {
                data[index] = dstColor;
                indexEast = index;
                indexWest = index;
                maxWest = ((index/pw)|0)*pw;
                maxEast = maxWest + pw;
                while(((--indexWest) >= maxWest) && srcColor === pickAt(data, indexWest)) {
                    data[indexWest] = dstColor;                    
                }
                while(((++indexEast) < maxEast) && srcColor === pickAt(data, indexEast)) {
                    data[indexEast] = dstColor;                    
                }
                for(var j=indexWest+1; j < indexEast; ++j) {
                    if ((j-pw >= 0) && srcColor === pickAt(data, j-pw)) {
                        queue.push(j-pw); // Queue y-1
                    }
                    if((j+pw < dataLength) && srcColor === pickAt(data, j+pw)) {
                        queue.push(j+pw); // Queue y+1
                    }
                }
            }
        }

        this._pixelData.put();
        console.timeEnd("Fill");
    }

    /**
     * Fill all pixels with the same color as the one at coords given.
     * @param {*} x
     * @param {*} y
     * @param {*} color
     */
    fillAll(x, y, color) {
        console.time("Fill all");

        const pw = this.width;
        const ph = this.height;

        const data = this._pixelData.get(0, 0, pw, ph);

        let index = x + y * pw;

        const pickAt = this._getIntColorAt;
        const srcColor = pickAt(data, index);
        const dstColor = color.rgba32;

        if (srcColor === dstColor) {
            console.info("Source and Destination Colors are Equal");
            return;
        } else {
            for (let i = 0; i < data.length; ++i) {
                if (pickAt(data, i) === srcColor) {
                    data[i] = dstColor;
                }
            }

            this._pixelData.put();
        }

        console.timeEnd("Fill all");
    }

    /**
     * Replaces all pixels having ColorRgba c1 with ColorRgba c2
     * @param {*} c1
     * @param {*} c2
     */
    replaceColor(c1, c2) {
        const pw = this.width;
        const ph = this.height;

        const pickAt = this._getIntColorAt;
        const data = this._pixelData.get(0, 0, pw, ph);
        const c2rgba = c2.rgba32;

        for (let i = 0; i < data.length; ++i) {
            if (pickAt(data, i) === c1) {
                data[i] = c2rgba;
            }
        }

        this._pixelData.put();
    }

    /**
     * Draws and image source to this bitmap
     * @param {*} bitmapSource
     * @param {*} width
     * @param {*} height
     */
    drawBitmap(bitmapSource, width, height) {
        if (width === undefined && height === undefined) {
            this._gfx.drawImage(bitmapSource, 0, 0);
        } else {
            this._gfx.drawImage(bitmapSource, 0, 0, width, height);
        }
    }

    pastePixmap(pixmap) {
        this.drawBitmap(pixmap.canvas, pixmap.width, pixmap.height);
    }

    /**
     * Draws an image source to this bitmap at given point
     * @param {*} bitmapSource
     * @param {*} x
     * @param {*} y
     */
    drawBitmapAt(bitmapSource, x, y) {
        this._gfx.drawImage(bitmapSource, x, y);
    }

    /**
     * Inverts the pixel's colors
     */
    filterInvert() {
        console.time("Filter Invert Done");

        const pw = this.width;
        const ph = this.height;
        const data = this._pixelData.get(0, 0, pw, ph);

        for (let i = 0; i < data.length; ++i) {
            const dataPixel = data[p];
            if (((dataPixel >> 24) & 0x000000ff) === 0) {
                continue;
            }

            const ir = (255 - dataPixel) & 0x000000ff;
            const ig = 255 - ((dataPixel >> 8) & 0x000000ff);
            const ib = 255 - ((dataPixel >> 16) & 0x000000ff);
            const ia = (dataPixel >> 24) & 0x000000ff;

            data[p] = ir | (ig << 8) | (ib << 16) | (ia << 24);
        }

        this._pixelData.put();

        console.timeEnd("Filter Invert Done");
    }


    /**
     * Change Pixmap to Black & White
     */
    filterBlackWhite() {
        console.time("Filter BlackWhite Done");

        const pw = this.width;
        const ph = this.height;
        const data = this._pixelData.get(0, 0, pw, ph);
        const area = pw * ph;

        for (let p = 0; p < area; ++p) {
            const dataPixel = data[p];
            if (((dataPixel >> 24) & 0x000000ff) === 0) {
                continue;
            }

            const newCol =
                ((dataPixel & 0x000000ff) * 0.8086) |
                0 |
                (((((dataPixel >> 8) & 0x000000ff) * 0.6094) | 0) << 8) |
                (((((dataPixel >> 16) & 0x000000ff) * 0.082) | 0) << 16) |
                (((dataPixel >> 24) & 0x000000ff) << 24);

            data[p] = newCol;
        }

        this._pixelData.put();

        console.timeEnd("Filter BlackWhite Done");
    }

    /**
     * Change the brightness of the Pixmap
     * @param {Number} brightness (-255 ~ 255)
     */
    filterBrightness(brightness) {
        console.time("Filter Brightness Done");

        brightness = clamp(Math.round(brightness), -255, 255);

        const pw = this.width;
        const ph = this.height;
        const data = this._pixelData.get(0, 0, pw, ph);
        const area = pw * ph;

        for (let p = 0; p < area; ++p) {
            const dataPixel = data[p];
            if (((dataPixel >> 24) & 0x000000ff) === 0) {
                continue;
            }

            const newCol =
                ((dataPixel & 0x000000ff) + brightness) |
                ((((dataPixel >> 8) & 0x000000ff) + brightness) << 8) |
                ((((dataPixel >> 16) & 0x000000ff) + brightness) << 16) |
                (((dataPixel >> 24) & 0x000000ff) << 24);

            data[p] = newCol;
        }

        this._pixelData.put();

        console.timeEnd("Filter Brightness Done");
    }

    /**
     * Change the contrast of the Pixmap
     * @param {Number} contrast (-255 ~ 255)
     */
    filterContrast(contrast) {
        console.time("Filter Contrast Done");

        contrast = clamp(Math.round(contrast), -255, 255);

        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        const pw = this.width;
        const ph = this.height;
        const data = this._pixelData.get(0, 0, pw, ph);
        const area = pw * ph;

        for (let p = 0; p < area; ++p) {
            const dataPixel = data[p];
            if (((dataPixel >> 24) & 0x000000ff) === 0) {
                continue;
            }

            const newCol =
                (((dataPixel & 0x000000ff) - 128) * factor + 128) |
                (((((dataPixel >> 8) & 0x000000ff) - 128) * factor + 128) <<
                    8) |
                (((((dataPixel >> 16) & 0x000000ff) - 128) * factor + 128) <<
                    16) |
                (((dataPixel >> 24) & 0x000000ff) << 24);

            data[p] = newCol;
        }

        this._pixelData.put();

        console.timeEnd("Filter Contrast Done");
    }

    /**
     * Apply gama correction
     * @param {Number} gamma (0.01 ~ 10.0)
     */
    filterGamma(gamma) {
        console.time("Filter Gamma Correction Done");

        gamma = clamp(gamma, 0.01, 10.0);

        const cache = [];

        for (let i = 0; i < 256; i++) {
            cache[i] = 255 * Math.pow(i / 255, gamma);
        }

        const pw = this.width;
        const ph = this.height;
        const data = this._pixelData.get(0, 0, pw, ph);
        const area = pw * ph;

        for (let p = 0; p < area; ++p) {
            const dataPixel = data[p];
            if (((dataPixel >> 24) & 0x000000ff) === 0) {
                continue;
            }

            const newCol =
                cache[dataPixel & 0x000000ff] |
                cache[((dataPixel >> 8) & 0x000000ff) << 8] |
                cache[((dataPixel >> 16) & 0x000000ff) << 16] |
                (((dataPixel >> 24) & 0x000000ff) << 24);

            data[p] = newCol;
        }

        this._pixelData.put();

        console.timeEnd("Filter Gamma Correction Done");
    }

    /**
     * Change the pixmap's colors hue value
     * @param {Number} hue (-360 ~ 360)
     */
    // filterHue(hue) {
    //     console.time("Filter Hue Done");

    //     hue = clamp(Math.round(hue), -360, 360);

    //     const cache = [];

    //     const pw = this.width;
    //     const ph = this.height;
    //     const data = this._pixelData.get(0, 0, pw, ph);
    //     const area = pw * ph;
    //     let index = 0;

    //     for (let p = 0; p < area; p++) {
    //         const dataPixel = data[p];
    //         if (((dataPixel >> 24) & 0x000000ff) === 0) {
    //             continue;
    //         }

    //         const ci =
    //             (dataPixel & 0x000000ff) * 65536 +
    //             ((dataPixel >> 8) & 0x000000ff) * 256 +
    //             ((dataPixel >> 16) & 0x000000ff);

    //         if (!cache[ci]) {
    //             cache[ci] = ColorHsv.FromRgbaColor(ColorRgba.fromRgba32(dataPixel));
    //             cache[ci].hue += hue;
    //         }

    //         data[index] = Math.floor(cache[ci].red);
    //         data[index + 1] = Math.floor(cache[ci].green);
    //         data[index + 2] = Math.floor(cache[ci].blue);
    //     }

    //     this._gfx.putImageData(imageData, 0, 0);

    //     console.timeEnd("Filter Hue Done");
    // }

    /**
     * Change the pixmap's colors saturation value
     * @param {Number} saturation (-100 ~ +300)
     */
    // filterSaturation(saturation) {
    //     console.time("Filter Saturation Done");

    //     saturation = clamp(saturation, -100, 300) / 100 + 1; // 0: desaturate, 1: no change, > 1 saturate more

    //     const cache = [];

    //     const pw = this.width;
    //     const ph = this.height;
    //     const imageData = this._gfx.getImageData(0, 0, pw, ph);
    //     const data = imageData.data;

    //     const area = pw * ph;
    //     let index = 0;

    //     for (let p = 0; p < area; p++) {
    //         index = p * 4;

    //         if (data[index + 3 === 0]) continue;

    //         const ci =
    //             data[index] * 65536 + data[index + 1] * 256 + data[index + 2];

    //         if (!cache[ci]) {
    //             cache[ci] = [data[index], data[index + 1], data[index + 2]];

    //             const desaturateColor =
    //                 cache[ci][0] * 0.3086 +
    //                 cache[ci][1] * 0.6094 +
    //                 cache[ci][2] * 0.082;

    //             cache[ci][0] = Math.floor(
    //                 clamp(
    //                     desaturateColor * (1 - saturation) +
    //                         cache[ci][0] * saturation,
    //                     0,
    //                     1
    //                 ) * 255
    //             );
    //             cache[ci][1] = Math.floor(
    //                 clamp(
    //                     desaturateColor * (1 - saturation) +
    //                         cache[ci][1] * saturation,
    //                     0,
    //                     1
    //                 ) * 255
    //             );
    //             cache[ci][2] = Math.floor(
    //                 clamp(
    //                     desaturateColor * (1 - saturation) +
    //                         cache[ci][2] * saturation,
    //                     0,
    //                     1
    //                 ) * 255
    //             );
    //         }

    //         data[index] = Math.floor(cache[ci][0]);
    //         data[index + 1] = Math.floor(cache[ci][1]);
    //         data[index + 2] = Math.floor(cache[ci][2]);
    //     }

    //     this._gfx.putImageData(imageData, 0, 0);

    //     console.timeEnd("Filter Saturation Done");
    // }

    /**
     * Convert the Pixmap's colors to the nearest color defined in the pallete
     * @param {Array} pallete (ColorRgba Array)
     */
    // filterPallete(pallete) {
    //     console.time("Filter Pallete Done");

    //     const pw = this.width;
    //     const ph = this.height;
    //     const imageData = this._gfx.getImageData(0, 0, pw, ph);
    //     const data = imageData.data;

    //     const area = pw * ph;
    //     let index = 0;

    //     let nearestColor = null;
    //     let minimumDistance = 3 * 255 * 255 + 1;
    //     let distance = 0;

    //     for (let p = 0; p < area; p++) {
    //         index = p * 4;

    //         if (data[index + 3 === 0]) continue;

    //         nearestColor = null;

    //         for (let i = 0; i < pallete.length; i++) {
    //             if (pallete[i].alpha === 0) continue;

    //             const rDiff = data[index] - pallete[i].red;
    //             const gDiff = data[index + 1] - pallete[i].green;
    //             const bDiff = data[index + 2] - pallete[i].blue;

    //             distance = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;

    //             if (distance < minimumDistance) {
    //                 nearestColor = pallete[i];
    //                 minimumDistance = distance;
    //             }
    //         }

    //         if (nearestColor !== null) {
    //             data[index] = nearestColor.red;
    //             data[index + 1] = nearestColor.green;
    //             data[index + 2] = nearestColor.blue;
    //         }
    //     }

    //     this._gfx.putImageData(imageData, 0, 0);

    //     console.timeEnd("Filter Pallete Done");
    // }

    /**
     * Convert the Pixmap's colors to the nearest color defined in the pallete
     * Uses Floyd-Steinberg error difusion dithering
     * @param {Array} pallete (ColorRgba Array)
     */
    // filterPalleteDither(pallete) {
    //     console.time("Filter Pallete Done");

    //     const pw = this.width;
    //     const ph = this.height;
    //     const imageData = this._gfx.getImageData(0, 0, pw, ph);
    //     const data = imageData.data;

    //     const area = pw * ph;
    //     let index = 0;

    //     let nearestColor = null;
    //     let minimumDistance = 3 * 255 * 255 + 1;
    //     let distance = 0;

    //     for (let p = 0; p < area; p++) {
    //         index = p * 4;

    //         if (data[index + 3 === 0]) continue;

    //         nearestColor = null;

    //         for (let i = 0; i < pallete.length; i++) {
    //             if (pallete[i].alpha === 0) continue;

    //             const rDiff = data[index] - pallete[i].red;
    //             const gDiff = data[index + 1] - pallete[i].green;
    //             const bDiff = data[index + 2] - pallete[i].blue;

    //             distance = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;

    //             if (distance < minimumDistance) {
    //                 nearestColor = pallete[i];
    //                 minimumDistance = distance;
    //             }
    //         }

    //         if (nearestColor !== null) {
    //             const x = p % pw;
    //             const y = Math.floor(p / pw);

    //             if (x < pw - 1) {
    //                 data[(p + 1) * 4] +=
    //                     (7 / 16) * (data[index] - nearestColor.red);
    //             }

    //             if (y < ph - 1 && x !== 0) {
    //                 data[(p + pw - 1) * 4] +=
    //                     (3 / 16) * (data[index] - nearestColor.red);
    //             }

    //             if (y < ph - 1) {
    //                 data[(p + pw) * 4] +=
    //                     (5 / 16) * (data[index] - nearestColor.red);
    //             }

    //             if (y < ph - 1 && x !== pw - 1) {
    //                 data[(p + pw + 1) * 4] +=
    //                     (1 / 16) * (data[index] - nearestColor.red);
    //             }

    //             data[index] = nearestColor.red;
    //             data[index + 1] = nearestColor.green;
    //             data[index + 2] = nearestColor.blue;
    //         }
    //     }

    //     this._gfx.putImageData(imageData, 0, 0);

    //     console.timeEnd("Filter Pallete Done");
    // }

    /**
     * Adds and outline to all pixels in the Pixmap
     * @param {ColorRgba} color
     */
    // filterOutline(color) {
    //     console.time("Filter Outline Done");

    //     const pw = this.width;
    //     const ph = this.height;
    //     const imageData = this._gfx.getImageData(0, 0, pw, ph);
    //     const data = imageData.data;

    //     const area = pw * ph;
    //     let index = 0;

    //     const pixels = new Int8Array(area);

    //     for (let p = 0; p < area; p++) {
    //         index = p * 4;

    //         if (data[index + 3 === 0]) continue;

    //         // if(this.file.selection.isActive() && !this.file.selection.selection[p]) continue

    //         const pX = p % pw;
    //         const pY = Math.floor(p / pw);

    //         for (let y = pY - 1; y <= pY + 1; y++) {
    //             for (let x = pX - 1; x <= pX + 1; x++) {
    //                 if (x === pX && y === pY) continue;

    //                 if (y < 0 || x < 0 || y >= ph || x >= pw) continue;

    //                 const ci = y + pw + x;

    //                 if (data[ci * 4 + 3] === 0) {
    //                     pixels[index] = true;
    //                 }
    //             }
    //         }
    //     }

    //     for (let i = 0; i < pixels.length; i++) {
    //         if (pixels[i]) {
    //             index = i * 4;

    //             data[index] = color.red;
    //             data[index + 1] = color.green;
    //             data[index + 2] = color.blue;
    //             data[index + 3] = color.alpha;
    //         }
    //     }

    //     this._gfx.putImageData(imageData, 0, 0);

    //     console.timeEnd("Filter Hue Done");
    // }

    /**
     * Get and array containing all the colors in the Pixmap
     */
    getPallete() {
        const uniqueColors = [];
        const data = this._pixelData.get(0, 0, this.width, this.height);
        for (let i = 0; i < data.length; ++i) {
            const col = data[i];
            if(col === 0){
                continue;
            }
            if (uniqueColors.indexOf(col) === -1) {
                uniqueColors.push(col);
            }
        }

        const palette = [];

        if (uniqueColors.length === 0) {
            return palette;
        }

        for(let i = 0; i < uniqueColors.length; ++i) {
            palette.push(ColorRgba.fromRgba32(uniqueColors[i]).hexStr);
        }

        return palette;
    }
}
