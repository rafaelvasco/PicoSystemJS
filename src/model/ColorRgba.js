export default class ColorRgba {

    constructor(r = 0, g = 0, b = 0, a = 255){

        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    static fromRgba32(rgba32) {
        const col = new ColorRgba();
        col.setIntRGBA(rgba32);
        return col;
    }

    get hexStr() {
        let r = this._r.toString(16);
        let g = this._g.toString(16);
        let b = this._b.toString(16);

        if (this._r < 16) { r = '0' + r; }
        if (this._g < 16) { g = '0' + g; }
        if (this._b < 16) { b = '0' + b; }

        return `#${r}${g}${b}`.toUpperCase();
    }

    get rgba32() {
        return  this._r |
                (this._g << 8) |
                (this._b << 16) |
                (this._a << 24);
    }

    get array() {
        return [this._r, this._g, this._b, this._a];
    }

    get rgbaStr() {
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${(Math.round(this._a / 255 * 10))/10})`;
    }

    get red() {
        return this._r;
    }

    set red(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._r = val | 0;
    }

    get green() {
        return this._g;
    }

    set green(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._g = val | 0;
    }

    get blue() {
        return this._b;
    }

    set blue(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._b = val | 0;
    }

    get alpha() {
        return this._a;
    }

    set alpha(val) {
        if (this._isValidRGBValue(val) === false) {
            return;
        }
        this._a = val | 0;
    }

    copy(obj) {
        
        if (obj instanceof ColorRgba === false) {
            console.error("Can't copy object other than ColorRgba.");
            return;
        }

        this._r = obj._r;
        this._g = obj._g;
        this._b = obj._b;
        this._a = obj._a;
    }

    setRGBA(r, g, b, a = 255) {

        if (
            this._isValidRGBValue(r) === false ||
            this._isValidRGBValue(g) === false || 
            this._isValidRGBValue(g) === false || 
            this._isValidRGBValue(a) === false
        ) {
            console.error(`setRGBA invalid values: ${[r, g, b, a]}`);
            return;
        }

        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
        return this;

    }

    setIntRGBA(rgba32) {
        this.setRGBA(
            rgba32 & 0x000000ff,
            (rgba32 >> 8) & 0x000000ff,
            (rgba32 >> 16) & 0x000000ff,
            255,
        );
    }

    setHEX(hex) {
        hex = hex.toUpperCase();
        const valid = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.test(hex);
        if (valid === false) {
            console.error(`Invalid hex color: ${hex}`);
            return;
        }

        if (hex[0] === '#') {
            hex = hex.slice(1);
        }

        if (hex.length === 3) {
            hex = hex.replace(/([0-9A-F])([0-9A-F])([0-9A-F])/i, '$1$1$2$2$3$3');
        }

       this._r = parseInt(hex.substr(0, 2), 16);
       this._g = parseInt(hex.substr(2, 2), 16);
       this._b = parseInt(hex.substr(4, 2), 16);
       this._a = 255;

        return this;
    }


    _isValidRGBValue(val) {
        return (
            typeof (val) === 'number' &&
            isNaN(val) === false &&
            val >= 0 &&
            val <= 255
        );
    }

    setFromHSV(h, s, v) {

        const sat = s / 100;
        const val = v / 100;
        let C = sat * val;
        const H = h / 60;
        let X = C * (1 - Math.abs(H % 2 - 1));
        let m = val - C;
        const precision = 255;

        C = Math.ceil((C + m) * precision) | 0;
        X = Math.ceil((X + m) * precision) | 0;
        m = Math.ceil(m * precision) | 0;

        if (H >= 0 && H < 1) {
            this.setRGBA(C, X, m);
            return;
        }

        if (H >= 1 && H < 2) {
            this.setRGBA(X, C, m);
            return;
        }

        if (H >= 2 && H < 3) {
            this.setRGBA(m, C, X);
            return;
        }

        if (H >= 3 && H < 4) {
            this.setRGBA(m, X, C);
            return;
        }

        if (H >= 4 && H < 5) {
            this.setRGBA(X, m, C);
            return;
        }

        if (H >= 5 && H < 6) {
            this.setRGBA(C, m, X);
            return;
        }
    }


    setFromHSL(h, s, l) {

        const sat = s / 100;
        const lig = l / 100;

        let C = sat * (1 - Math.abs(2 * lig - 1));
        const H = h / 60;
        let X = C * (1 - Math.abs(H % 2 - 1));
        let m = lig - C / 2;
        const precision = 255;

        C = (C + m) * precision | 0;
        X = (X + m) * precision | 0;
        m = m * precision | 0;

        if (H >= 0 && H < 1) { this.setRGBA(C, X, m); return; }
        if (H >= 1 && H < 2) { this.setRGBA(X, C, m); return; }
        if (H >= 2 && H < 3) { this.setRGBA(m, C, X); return; }
        if (H >= 3 && H < 4) { this.setRGBA(m, X, C); return; }
        if (H >= 4 && H < 5) { this.setRGBA(X, m, C); return; }
        if (H >= 5 && H < 6) { this.setRGBA(C, m, X); return; }
    }

    toString() {
        return this.rgbaStr;
    }
}

ColorRgba.Red = new ColorRgba(255, 0, 0);
ColorRgba.Green = new ColorRgba(0, 255, 0);
ColorRgba.Blue = new ColorRgba(0, 0, 255);
ColorRgba.Black = new ColorRgba(0, 0, 0);
ColorRgba.White = new ColorRgba(255, 255, 255);
ColorRgba.Transparent = new ColorRgba(0, 0, 0, 0);
ColorRgba.Fuschia = new ColorRgba(255, 0, 255);
ColorRgba.Yellow = new ColorRgba(255, 255, 0);
ColorRgba.Cyan = new ColorRgba(0, 255, 255);

