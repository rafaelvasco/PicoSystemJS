import Rect from "../../model/Rect";

export default class CanvasDropDown {
    constructor(params) {
        this.parent = params.parent;
        this._items = [];
        this._currentIndex = 0;
        this.bounds = new Rect(params.x, params.y, params.w, params.h);
        this.backColor = params.backColor;
        this.borderColor = params.borderColor;
        this.font = params.font,
        this.textColor = params.textColor;
        this._dropdown = false;
    }

    addItem(label, value) {
        this._items.push({
            label: label,
            value: value
        });
    }

    onMouseDown(button, x, y) {
        console.log('Dropdown Click');
        if(this._items.length > 0) {
            this._dropdown = !this._dropdown;
            this.parent.paint();
        }
        
    }

    paint(g) {
        g.fillStyle = this.backColor;
        const x = this.bounds.x;
        const y = this.bounds.y;
        const w = this.bounds.width;
        const h = this.bounds.height;
        g.fillRect(x, y, w, h);
        g.strokeStyle = this.borderColor;
        g.strokeRect(x, y, w, h);
        if (this._items.length > 0) {
            const currentItem = this._items[this._currentIndex];
            g.font = this.font;
            g.fillStyle = this.textColor;
            const textMeasure = g.measureText(currentItem.label);
            g.fillText(
                currentItem.label,
                x + w / 2 - textMeasure.width / 2,
                y + h / 2 + textMeasure.actualBoundingBoxAscent / 2
            );

            if(this._dropdown === true) {
                g.fillStyle = this.backColor;
                g.strokeStyle = this.borderColor;
                const dropdownHeight = this._items.length * 20;
                const dropdownY = y - dropdownHeight - 1;
                g.fillRect(x, dropdownY, this.bounds.width, dropdownHeight);
                g.strokeRect(x, dropdownY, this.bounds.width, dropdownHeight);
            }
        }
    }
}
