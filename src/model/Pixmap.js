import ColorRgba from "./ColorRgba";
import { HorizontalAnchor, VerticalAnchor } from "./Enums";

export default class Pixmap {
    constructor(width, height) {
        this._canvas = null;
        this._gfx = null;
        this._dataUrl = null;
        this._pixelBuffer = [[], []];
        this._canvas = document.createElement("canvas");
        this._canvas.width = width;
        this._canvas.height = height;

        this._gfx = this._canvas.getContext("2d", {
            alpha: true,
            depth: false,
            antialias: false
        });

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
        const imageData = this._gfx.getImageData(x, y, 1, 1).data;
        return new ColorRgba(
            imageData[0],
            imageData[1],
            imageData[2],
            imageData[3]
        );
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
    resize(width, height, xAnchor, yAnchor) {
        const resizedData = new Uint8ClampedArray(width * height * 4);

        let nX = 0;
        let nY = 0;

        switch (xAnchor) {
            default:
            case HorizontalAnchor.Left:
                nX = 0;
                break;
            case HorizontalAnchor.Center:
                nX = Math.floor((width - this.width) / 2);
                break;
            case HorizontalAnchor.Right:
                nX = w - this.width;
                break;
        }

        switch (yAnchor) {
            default:
            case VerticalAnchor.Top:
                nY = 0;
                break;
            case VerticalAnchor.Center:
                nY = Math.floor((height - this.height) / 2);
                break;
            case VerticalAnchor.Bottom:
                nY = height - this.height;
                break;
        }

        const oldData = this._gfx.getImageData(0, 0, this.width, this.height)
            .data;

        for (let y = 0; y < height; ++y) {
            const originY = y - nY;

            if (originY < 0 || originY >= this.height) continue;

            for (let x = 0; x < width; ++x) {
                const originX = x - nX;

                if (originX < 0 || originX >= this.width) continue;

                const originIndex = originY * this.width + originX;
                const targetIndex = y * width + x;
                resizedData.set(
                    [
                        oldData[originIndex * 4],
                        oldData[originIndex * 4 + 1],
                        oldData[originIndex * 4 + 2],
                        oldData[originIndex * 4 + 3]
                    ],
                    targetIndex * 4
                );
            }
        }

        this._canvas.width = width;
        this._canvas.height = height;

        const newImageData = this._gfx.getImageData(0, 0, width, height);
        newImageData.data.set(resizedData, 0, 0);
        this._gfx.putImageData(newImageData, 0, 0);
    }

    /**
     * Crops the Pixmap
     * @param {*} x
     * @param {*} y
     * @param {*} w
     * @param {*} h
     */
    crop(x, y, w, h) {
        const cropData = this._gfx.getImageData(x, y, w, h);
        this._canvas.width = w;
        this._canvas.height = h;
        this._gfx.putImageData(cropData, 0, 0);
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

        const newData = new Uint8ClampedArray(pw * ph * 4);
        const currentData = this._gfx.getImageData(0, 0, pw, ph);
        const data = currentData.data;

        for (let y = 0; y < ph; ++y) {
            for (let x = 0; x < pw; ++x) {
                let co = (y * pw + (pw - x - 1)) * 4;
                let ci = (y * pw + x) * 4;

                newData.set(
                    [data[co], data[co + 1], data[co + 2], data[co + 3]],
                    ci
                );
            }
        }

        data.set(newData);
        this._gfx.putImageData(currentData, 0, 0);
    }

    /**
     * Mirrors Pixmap pixels vertically
     */
    mirrorVertical() {
        const pw = this.width;
        const ph = this.height;

        const newData = new Uint8ClampedArray(pw * ph * 4);
        const currentData = this._gfx.getImageData(0, 0, pw, ph);
        const data = currentData.data;

        for (let y = 0; y < ph; y++) {
            for (let x = 0; x < pw; x++) {
                let co = ((ph - y - 1) * pw + x) * 4;
                let ci = (y * pw + x) * 4;

                newData.set(
                    [data[co], data[co + 1], data[co + 2], data[co + 3]],
                    ci
                );
            }
        }

        data.set(newData);
        this._gfx.putImageData(imageData, 0, 0);
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
        const colArray = color.array;

        const pw = this.width;
        const ph = this.height;

        if (size === 1) {
            if (x < 0 || y < 0 || x >= pw || y >= ph) {
                return;
            }

            const imageData = this._gfx.getImageData(x, y, 1, 1);
            imageData.data.set(colArray, 0);
            this._gfx.putImageData(imageData, x, y);
            return;
        }

        const imageData = this._gfx.getImageData(x, y, size, size);
        const data = imageData.data;
        const area = size * size;

        for (let i = 0; i < area; i++) {
            const px = i % size;
            const py = Math.floor(i / size);

            if (
                x + px < 0 ||
                y + py < 0 ||
                x + px >= this.width ||
                y + py >= this.height
            ) {
                return;
            }

            data.set(colArray, i * 4);
        }

        this._gfx.putImageData(imageData, x, y);
    }

    drawPixelsLine(pixels, color) {
        if (pixels[0].length > 0) {
            const minX = Math.min.apply(null, pixels[0]);
            const maxX = Math.max.apply(null, pixels[0]);
            const minY = Math.min.apply(null, pixels[1]);
            const maxY = Math.max.apply(null, pixels[1]);
            const width = maxX - minX + 1;
            const height = maxY - minY + 1;

            const colorArray = color.array;

            const imageData = this._gfx.getImageData(minX, minY, width, height);
            const data = imageData.data;

            const length = pixels[0].length;

            for (let i = 0; i < length; i++) {
                data.set(
                    colorArray,
                    ((pixels[1][i] - minY) * width + (pixels[0][i] - minX)) * 4
                );
            }

            this._gfx.putImageData(imageData, minX, minY);
        }
    }

    drawPixels(pixels, color, minX, minY, maxX, maxY) {
        if (pixels[0].length > 0) {
            const width = maxX - minX + 1;
            const height = maxY - minY + 1;

            const colorArray = color.array;

            const imageData = this._gfx.getImageData(minX, minY, width, height);
            const data = imageData.data;

            const length = pixels[0].length;

            for (let i = 0; i < length; i++) {
                data.set(
                    colorArray,
                    ((pixels[1][i] - minY) * width + (pixels[0][i] - minX)) * 4
                );
            }

            this._gfx.putImageData(imageData, minX, minY);
        }
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
        const width = Math.abs(x1 - x2);
        const height = Math.abs(y1 - y2);

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

        const pixels = this._pixelBuffer;
        pixels[0].length = 0;
        pixels[1].length = 0;

        if (size === 1) {
            for (let x = 0; x <= width; x++) {
                pixels[0].push(x1 + x);
                pixels[1].push(y1);

                pixels[0].push(x1 + x);
                pixels[1].push(y2);
            }

            for (let y = 0; y < height; y++) {
                pixels[0].push(x1);
                pixels[1].push(y1 + y);

                pixels[0].push(x2);
                pixels[1].push(y1 + y);
            }
        } else {
            const w = width + size - 1;

            for (let x = 0; x <= w; x++) {
                for (let s = 0; s < size; s++) {
                    pixels[0].push(x1 + x);
                    pixels[1].push(y1 + s);
                }

                for (let s = 0; s < size; s++) {
                    pixels[0].push(x1 + x);
                    pixels[1].push(y2 + s);
                }
            }

            for (let y = 0; y <= height; y++) {
                for (let s = 0; s < size; s++) {
                    pixels[1].push(y1 + y);
                    pixels[0].push(x1 + s);
                }

                for (let s = 0; s < size; s++) {
                    pixels[1].push(y1 + y);
                    pixels[0].push(x2 + s);
                }
            }
        }

        this.drawPixels(
            pixels,
            color,
            x1 - size,
            y1 - size,
            x2 + size,
            y2 + size
        );
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
        let lastX = x1;
        let lastY = y1;

        let dx = Math.abs(x2 - x1);
        let dy = -Math.abs(y2 - y1);

        let sx = x1 < x2 ? size : -size;
        let sy = y1 < y2 ? size : -size;

        let error = dx + dy;

        let e2;

        const pixels = [[], []];

        const pw = this.width;
        const ph = this.height;

        while (true) {
            if (x1 !== lastX || y1 !== lastY) {
                if (x1 < 0 || y1 < 0 || x1 + size > pw || y1 + size > ph) {
                    break;
                }

                for (let y = y1; y < y1 + size; y++) {
                    for (let x = x1; x < x1 + size; x++) {
                        pixels[0].push(x);
                        pixels[1].push(y);
                    }
                }
            }

            lastX = x1;
            lastY = y1;

            if (x1 === x2 && y1 === y2) {
                break;
            }

            e2 = error * 2;

            if (e2 >= dy) {
                error += dy;
                x1 += sx;
            }
            if (e2 <= dx) {
                error += dx;
                y1 += sy;
            }
        }

        this.drawPixelsLine(pixels, color);
    }

    /**
     * Draws a circle with given color, keeping proportions or not
     * @param {*} x1
     * @param {*} y1
     * @param {*} x2
     * @param {*} y2
     * @param {*} color
     * @param {*} proportional
     */
    drawCircle(x1, y1, x2, y2, color, proportional = false) {
        let width = Math.abs(x1 - x2);
        let height = Math.abs(y1 - y2);

        if (width < 1 || height < 1) return;

        if (proportional === true) {
            width = Math.min(width, height);
            height = width;
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

        const pixels = this._pixelBuffer;
        pixels[0].length = 0;
        pixels[1].length = 0;

        for (let x = 0; x <= width; x++) {
            const xPerc = x / (width / 2) - 1;
            const yPerc = Math.sin(Math.acos(xPerc));
            const y = (yPerc * height) / 2;

            pixels[0].push(Math.round(x1 + x));
            pixels[1].push(Math.round(y1 + height / 2 + y));
            pixels[0].push(Math.round(x1 + x));
            pixels[1].push(Math.round(y1 + height / 2 - y));
        }

        for (let y = 0; y <= height; y++) {
            const yPerc = y / (height / 2) - 1;
            const xPerc = Math.cos(Math.asin(yPerc));
            const x = (xPerc * width) / 2;

            pixels[0].push(Math.round(x1 + width / 2 + x));
            pixels[1].push(Math.round(y1 + y));
            pixels[0].push(Math.round(x1 + width / 2 - x));
            pixels[1].push(Math.round(y1 + y));
        }

        this.drawPixels(pixels, color, x1, y1, x2, y2);
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
        //console.time("FillRect");
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

        const pixels = this._pixelBuffer;
        pixels[0].length = 0;
        pixels[1].length = 0;

        for (let x = x1; x < x2; x++) {
            for (let y = y1; y < y2; y++) {
                pixels[0].push(x);
                pixels[1].push(y);
            }
        }

        this.drawPixels(pixels, color, x1, y1, x2, y2);
        //console.timeEnd("FillRect");
    }

    /**
     * Fills a contiguous area (4 way flood fill)
     * @param {*} x
     * @param {*} y
     * @param {*} color
     */
    fill(x, y, color) {
        console.time("Fill");

        let pw = this.width;
        let ph = this.height;

        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        let index = pw * y + x;

        let srcColor = [
            data[index * 4],
            data[index * 4 + 1],
            data[index * 4 + 2],
            data[index * 4 + 3]
        ];

        const dstColor = color.array;

        let queue = [index];

        if (
            srcColor[0] === dstColor[0] &&
            srcColor[1] === dstColor[1] &&
            srcColor[2] === dstColor[2] &&
            srcColor[3] === dstColor[3]
        ) {
            console.info("Source and Destination Colors are Equal");
        } else {
            while (queue.length > 0) {
                let ci = queue.pop();

                index = ci * 4;

                if (
                    srcColor[3] === data[index + 3] &&
                    srcColor[2] === data[index + 2] &&
                    srcColor[1] === data[index + 1] &&
                    srcColor[0] === data[index]
                ) {
                    data.set(dstColor, index);

                    if (x > 0) queue.push(ci - 1);
                    if (x < pw - 1) queue.push(ci + 1);
                    if (y > 0) queue.push(ci - pw);
                    if (y < ph - 1) queue.push(ci + pw);
                }
            }
            console.timeEnd("Fill");

            this._gfx.putImageData(imageData, 0, 0);
        }
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

        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        let index = (pw * y + x) * 4;

        let srcColor = [
            data[index],
            data[index + 1],
            data[index + 2],
            data[index + 3]
        ];

        const dstColor = color.array;

        if (
            srcColor[0] === dstColor[0] &&
            srcColor[1] === dstColor[1] &&
            srcColor[2] === dstColor[2] &&
            srcColor[3] === dstColor[3]
        ) {
            console.info("Source and Destination Colors are Equal");
        } else {
            for (let p = 0; p < pw * ph; p++) {
                index = p * 4;

                if (
                    srcColor[3] === data[index + 3] &&
                    srcColor[2] === data[index + 2] &&
                    srcColor[1] === data[index + 1] &&
                    srcColor[0] === data[index]
                ) {
                    data.set(dstColor, index);
                }
            }

            this._gfx.putImageData(imageData, 0, 0);
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

        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;

        const c2Array = c2.array;

        for (let i = 0; i < area * 4; i += 4) {
            if (
                data[i + 3] === c1.alpha &&
                data[i] === c1.red &&
                data[i + 1] === c1.green &&
                data[i + 2] === c1.blue
            ) {
                data.set(c2Array, i);
            }
        }

        this._gfx.putImageData(imageData, 0, 0);
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
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            data.set(
                [
                    255 - data[index],
                    255 - data[index + 1],
                    255 - data[index + 2]
                ],
                index
            );
        }

        this._gfx.putImageData(imageData, 0, 0);

        console.timeEnd("Filter Invert Done");
    }

    /**
     * Change Pixmap to Black & White
     */
    filterBlackWhite() {
        console.time("Filter BlackWhite Done");

        const pw = this.width;
        const ph = this.height;
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            const v =
                data[index] * 0.8086 +
                data[index + 1] * 0.6094 +
                data[index + 2] * 0.082;

            data.set([v, v, v], index);
        }

        this._gfx.putImageData(imageData, 0, 0);

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
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            data[index] += brightness;
            data[index + 1] += brightness;
            data[index + 2] += brightness;
        }

        this._gfx.putImageData(imageData, 0, 0);

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
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            data[index] = factor * (data[index] - 128) + 128;
            data[index + 1] = factor * (data[index + 1] - 128) + 128;
            data[index + 2] = factor * (data[index + 2] - 128) + 128;
        }

        this._gfx.putImageData(imageData, 0, 0);

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
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            data[index] = cache[data[index]];
            data[index + 1] = cache[data[index + 1]];
            data[index + 2] = cache[data[index + 2]];
        }

        this._gfx.putImageData(imageData, 0, 0);

        console.timeEnd("Filter Gamma Correction Done");
    }

    /**
     * Change the pixmap's colors hue value
     * @param {Number} hue (-360 ~ 360)
     */
    filterHue(hue) {
        console.time("Filter Hue Done");

        hue = clamp(Math.round(hue), -360, 360) / 360;

        const cache = [];

        const pw = this.width;
        const ph = this.height;
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            const ci =
                data[index] * 65536 + data[index + 1] * 256 + data[index + 2];

            if (!cache[ci]) {
                cache[ci] = new ColorRgba(
                    data[index],
                    data[index + 1],
                    data[index + 2]
                );
                cache[ci].hue = cache[ci].hue + hue;
            }

            data[index] = Math.floor(cache[ci].red);
            data[index + 1] = Math.floor(cache[ci].green);
            data[index + 2] = Math.floor(cache[ci].blue);
        }

        this._gfx.putImageData(imageData, 0, 0);

        console.timeEnd("Filter Hue Done");
    }

    /**
     * Change the pixmap's colors saturation value
     * @param {Number} saturation (-100 ~ +300)
     */
    filterSaturation(saturation) {
        console.time("Filter Saturation Done");

        saturation = clamp(saturation, -100, 300) / 100 + 1; // 0: desaturate, 1: no change, > 1 saturate more

        const cache = [];

        const pw = this.width;
        const ph = this.height;
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            const ci =
                data[index] * 65536 + data[index + 1] * 256 + data[index + 2];

            if (!cache[ci]) {
                cache[ci] = [data[index], data[index + 1], data[index + 2]];

                const desaturateColor =
                    cache[ci][0] * 0.3086 +
                    cache[ci][1] * 0.6094 +
                    cache[ci][2] * 0.082;

                cache[ci][0] = Math.floor(
                    clamp(
                        desaturateColor * (1 - saturation) +
                            cache[ci][0] * saturation,
                        0,
                        1
                    ) * 255
                );
                cache[ci][1] = Math.floor(
                    clamp(
                        desaturateColor * (1 - saturation) +
                            cache[ci][1] * saturation,
                        0,
                        1
                    ) * 255
                );
                cache[ci][2] = Math.floor(
                    clamp(
                        desaturateColor * (1 - saturation) +
                            cache[ci][2] * saturation,
                        0,
                        1
                    ) * 255
                );
            }

            data[index] = Math.floor(cache[ci][0]);
            data[index + 1] = Math.floor(cache[ci][1]);
            data[index + 2] = Math.floor(cache[ci][2]);
        }

        this._gfx.putImageData(imageData, 0, 0);

        console.timeEnd("Filter Saturation Done");
    }

    /**
     * Convert the Pixmap's colors to the nearest color defined in the pallete
     * @param {Array} pallete (ColorRgba Array)
     */
    filterPallete(pallete) {
        console.time("Filter Pallete Done");

        const pw = this.width;
        const ph = this.height;
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        let nearestColor = null;
        let minimumDistance = 3 * 255 * 255 + 1;
        let distance = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            nearestColor = null;

            for (let i = 0; i < pallete.length; i++) {
                if (pallete[i].alpha === 0) continue;

                const rDiff = data[index] - pallete[i].red;
                const gDiff = data[index + 1] - pallete[i].green;
                const bDiff = data[index + 2] - pallete[i].blue;

                distance = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;

                if (distance < minimumDistance) {
                    nearestColor = pallete[i];
                    minimumDistance = distance;
                }
            }

            if (nearestColor !== null) {
                data[index] = nearestColor.red;
                data[index + 1] = nearestColor.green;
                data[index + 2] = nearestColor.blue;
            }
        }

        this._gfx.putImageData(imageData, 0, 0);

        console.timeEnd("Filter Pallete Done");
    }

    /**
     * Convert the Pixmap's colors to the nearest color defined in the pallete
     * Uses Floyd-Steinberg error difusion dithering
     * @param {Array} pallete (ColorRgba Array)
     */
    filterPalleteDither(pallete) {
        console.time("Filter Pallete Done");

        const pw = this.width;
        const ph = this.height;
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        let nearestColor = null;
        let minimumDistance = 3 * 255 * 255 + 1;
        let distance = 0;

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            nearestColor = null;

            for (let i = 0; i < pallete.length; i++) {
                if (pallete[i].alpha === 0) continue;

                const rDiff = data[index] - pallete[i].red;
                const gDiff = data[index + 1] - pallete[i].green;
                const bDiff = data[index + 2] - pallete[i].blue;

                distance = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;

                if (distance < minimumDistance) {
                    nearestColor = pallete[i];
                    minimumDistance = distance;
                }
            }

            if (nearestColor !== null) {
                const x = p % pw;
                const y = Math.floor(p / pw);

                if (x < pw - 1) {
                    data[(p + 1) * 4] +=
                        (7 / 16) * (data[index] - nearestColor.red);
                }

                if (y < ph - 1 && x !== 0) {
                    data[(p + pw - 1) * 4] +=
                        (3 / 16) * (data[index] - nearestColor.red);
                }

                if (y < ph - 1) {
                    data[(p + pw) * 4] +=
                        (5 / 16) * (data[index] - nearestColor.red);
                }

                if (y < ph - 1 && x !== pw - 1) {
                    data[(p + pw + 1) * 4] +=
                        (1 / 16) * (data[index] - nearestColor.red);
                }

                data[index] = nearestColor.red;
                data[index + 1] = nearestColor.green;
                data[index + 2] = nearestColor.blue;
            }
        }

        this._gfx.putImageData(imageData, 0, 0);

        console.timeEnd("Filter Pallete Done");
    }

    /**
     * Adds and outline to all pixels in the Pixmap
     * @param {ColorRgba} color
     */
    filterOutline(color) {
        console.time("Filter Outline Done");

        const pw = this.width;
        const ph = this.height;
        const imageData = this._gfx.getImageData(0, 0, pw, ph);
        const data = imageData.data;

        const area = pw * ph;
        let index = 0;

        const pixels = new Int8Array(area);

        for (let p = 0; p < area; p++) {
            index = p * 4;

            if (data[index + 3 === 0]) continue;

            // if(this.file.selection.isActive() && !this.file.selection.selection[p]) continue

            const pX = p % pw;
            const pY = Math.floor(p / pw);

            for (let y = pY - 1; y <= pY + 1; y++) {
                for (let x = pX - 1; x <= pX + 1; x++) {
                    if (x === pX && y === pY) continue;

                    if (y < 0 || x < 0 || y >= ph || x >= pw) continue;

                    const ci = y + pw + x;

                    if (data[ci * 4 + 3] === 0) {
                        pixels[index] = true;
                    }
                }
            }
        }

        for (let i = 0; i < pixels.length; i++) {
            if (pixels[i]) {
                index = i * 4;

                data[index] = color.red;
                data[index + 1] = color.green;
                data[index + 2] = color.blue;
                data[index + 3] = color.alpha;
            }
        }

        this._gfx.putImageData(imageData, 0, 0);

        console.timeEnd("Filter Hue Done");
    }

    /**
     * Get and array containing all the colors in the Pixmap
     */
    getPallete() {
        // TODO: Do not repeat colors

        let pallete = [];

        const imageData = this._gfx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; ++i) {
            let r = data[0];
            let g = data[1];
            let b = data[2];
            let a = data[3];

            let color = new ColorRgba(r, g, b, a);

            pallete.push(color);
        }

        return pallete;
    }
}
