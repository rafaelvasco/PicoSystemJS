import Rect from "../../model/Rect";

export default class CanvasDropDown {
    static ItemHeight = 30;

    constructor(params) {
        this.parent = params.parent;
        this._items = [];
        this._currentIndex = 0;
        this.bounds = new Rect(params.x, params.y, params.w, params.h);
        this.backColor = params.backColor;
        this.borderColor = params.borderColor;
        (this.font = params.font), (this.textColor = params.textColor);
        this._dropdown = false;
        this._translationY = 0;
        this._dropDownHeight = 0;
        this._maxTranslationY = 0;
    }

    addItem(label, value) {
        this._items.push({
            label: label,
            value: value
        });
        this._recalculateDropdownHeight();
    }

    _recalculateDropdownHeight() {
        const labelMeasure = this.parent._gfx.measureText(this._items[0].label);
        this._dropDownHeight =
            this._items.length * CanvasDropDown.ItemHeight +
            labelMeasure.actualBoundingBoxAscent;

        if (
            this._dropDownHeight >
            this.parent.height - this.bounds.height - CanvasDropDown.ItemHeight
        ) {
            this._dropDownHeight = this.parent.height - this.bounds.height - CanvasDropDown.ItemHeight;
        }
        this._maxTranslationY = (this._items.length - (Math.floor(this._dropDownHeight/CanvasDropDown.ItemHeight))) * CanvasDropDown.ItemHeight;
    }

    onMouseDown(button, x, y) {
        if (this._items.length > 0) {
            this._dropdown = !this._dropdown;
            this._translationY = 0;
            this.parent.paint();
        }
    }

    onMouseWheel(delta) {
        const signDelta = Math.sign(delta);
        this._translationY -= signDelta * CanvasDropDown.ItemHeight;
        if (this._translationY > 0) {
            this._translationY = 0;
        }
        if (this._translationY < -this._maxTranslationY) {
            this._translationY = -this._maxTranslationY;
        }
        this.parent.paint();
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
            const labelHeight = textMeasure.actualBoundingBoxAscent;
            g.fillText(
                currentItem.label,
                x + w / 2 - textMeasure.width / 2,
                y + h / 2 + labelHeight / 2
            );

            if (this._dropdown === true) {
                g.fillStyle = this.backColor;
                g.strokeStyle = this.borderColor;
               
                const dropdownY = y - this._dropDownHeight - 1;
                g.beginPath();
                g.rect(x, dropdownY, this.bounds.width, this._dropDownHeight);
                g.clip();
                g.fill();
                g.stroke();
                g.translate(0, this._translationY);
                for (let i = 0; i < this._items.length; ++i) {
                    const item = this._items[i];
                    const textMeasure = g.measureText(item.label);
                    g.fillStyle = this.textColor;
                    const labelWidth = textMeasure.width;
                    g.fillText(
                        item.label,
                        x + w / 2 - labelWidth / 2,
                        dropdownY +
                            labelHeight / 2 +
                            i * CanvasDropDown.ItemHeight +
                            labelHeight * 2
                    );
                }
            }
        }
    }
}
