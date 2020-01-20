export default class ColorHsl {

    constructor(){

        this._hue = 0;
        this._sat = 0;
        this._light = 0;
    }


    get hslStr() {
        return `hsl(${this._hue}, ${this._sat}, ${this._light})`;
    }

    get hue () {
        return this._hue
    }
    
    set hue (val) {

        if (this._isValidHSLValue(val) === false) {
            console.error(`Invalid hue value: ${val}`);
            return;
        }

        if (val > 359) {
            val = 0
        }

        this._hue = val
    }

    get saturation() {
        return this._sat;
    }

    set saturation() {
        
        if (this._isValidHSLValue(val) === false) {
            console.error(`Invalid saturation value: ${val}`);
            return;
        }

        this._sat = val;
    }

    get lightness() {
        return this._light;
    }

    set lightness(val) {

        if (this._isValidHSLValue(val) === false) {
            return;
        }

        this._light = val;
    }

    copy(obj) {
        
        if (obj instanceof ColorHsl === false) {
            console.error("Can't copy object other than ColorHsl.");
            return;
        }

        this._hue = obj._hue;
        this._sat = obj._sat;
        this._light = obj._light;
    }

    setHSL(h, s, l) {

        if (
            this._isValidHSLValue(h) === false ||
            this._isValidHSLValue(s) === false ||
            this._isValidHSLValue(l) === false            
        ) {
            console.error(`Invalid HSL Values: ${[h, s, l]}`);
        }

        this._hue = h;
        this._sat = l;
        this._light = l;
        this._needsUpdateRgb = true;
    }

    _isValidHSLValue(val) {
        return (
                typeof val === 'number' &&
                isNaN(val) === false && 
                val >= 0 &&
                val <= 100
        );

    }


    setFromRGB(r, g, b) {
        
        const red = r / 255;
        const green = g / 255;
        const blue = b / 255;

        const cmax = Math.max(red, green, blue);
        const cmin = Math.min(red, green, blue);
        const delta = cmax - cmin;

        let hue = 0;
        let sat = 0;
        const lightness = (cmax + cmin) / 2;
        const X = (1 - Math.abs(2 * lightness - 1));

        if (delta) {
            if (cmax === red) { hue = ((green - blue) / delta); }
            if (cmax === green) { hue = 2 + (blue - red) / delta; }
            if (cmax === blue) { hue = 4 + (red - green) / delta; }
            if (cmax) { sat = delta / X; }
        }

        this._hue = 60 * hue | 0;

        if (this._hue < 0) { this._hue += 360; }

        this._sat = (sat * 100) | 0;

        this._light = (lightness * 100) | 0;

    }

}

