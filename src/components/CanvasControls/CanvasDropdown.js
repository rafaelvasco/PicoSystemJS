import Rect from "../../model/Rect";

export default class CanvasDropDown {
    static ItemHeight = 30;

    constructor(params) {
        this.parent = params.parent;
        this._items = [];
        this._currentIndex = 0;
        this._bounds = new Rect(params.x, params.y, params.w, params.h);
        this._backColor = params.backColor;
        this._borderColor = params.borderColor;
        this._font = params.font;
        this._textColor = params.textColor;
        this._itemHoverColor = params.itemHoverColor;
        this._dropdown = false;
        this._translationY = 0;
        this._dropDownHeight = 0;
        this._maxTranslationY = 0;
        this._hoveredIndex = -1;
        this._lastHoveredIndex = -1;
        this._dropdownY = 0;
    }

    get isDropdown() {
        return this._dropdown;
    }

    addItem(label, value) {
        this._items.push({
            label: label,
            value: value
        });
        this._rebuildDropDown();
    }

    _rebuildDropDown() {
        const labelMeasure = this.parent._gfx.measureText(this._items[0].label);
        this._dropDownHeight =
            this._items.length * CanvasDropDown.ItemHeight +
            labelMeasure.actualBoundingBoxAscent;

        if (
            this._dropDownHeight >
            this.parent.height - this._bounds.height - CanvasDropDown.ItemHeight
        ) {
            this._dropDownHeight =
                this.parent.height -
                this._bounds.height -
                CanvasDropDown.ItemHeight;
        }
        this._maxTranslationY =
            (this._items.length -
                Math.floor(this._dropDownHeight / CanvasDropDown.ItemHeight)) *
            CanvasDropDown.ItemHeight;
        this._dropdownY = this._bounds.y - this._dropDownHeight - 1;
    }

    onMouseDown(button, x, y) {
        if (this._items.length > 0) {
            if (this._bounds.containsPoint(x, y) && this._hoveredIndex === -1) {
                this._dropdown = !this._dropdown;
                this._translationY = 0;
                this.parent.paint();
            }
            else {
                this._dropdown = false;
                this._translationY = 0;
                this._currentIndex = this._hoveredIndex;
                this._hoveredIndex = -1;
                this.parent.paint();
            }
        }
    }

    onMouseMove(_, y) {
        const itemHeight = CanvasDropDown.ItemHeight;
        if (y > this._dropdownY && y < this._dropdownY + this._dropDownHeight) {
            this._lastHoveredIndex = this._hoveredIndex;
            this._hoveredIndex =
                ((y - this._dropdownY - this._translationY) / itemHeight) | 0;
            if (this._hoveredIndex !== this._lastHoveredIndex) {
                this.parent.paint();
                return;
            }
        } else {
            if (this._hoveredIndex >= 0) {
                this._hoveredIndex = -1;
                this.parent.paint();
                return;
            }
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
        g.save();
        g.fillStyle = this._backColor;
        const x = this._bounds.x;
        const y = this._bounds.y;
        const w = this._bounds.width;
        const h = this._bounds.height;
        const itemHeight = CanvasDropDown.ItemHeight;
        g.fillRect(x, y, w, h);
        g.strokeStyle = this._borderColor;
        g.strokeRect(x, y, w, h);
        if (this._items.length > 0) {
            const currentItem = this._items[this._currentIndex];
            g.font = this._font;
            g.fillStyle = this._textColor;
            const textMeasure = g.measureText(currentItem.label);
            const labelHeight = textMeasure.actualBoundingBoxAscent;
            g.fillText(
                currentItem.label,
                x + w / 2 - textMeasure.width / 2,
                y + h / 2 + labelHeight / 2
            );

            if (this._dropdown === true) {
                g.fillStyle = this._backColor;
                g.strokeStyle = this._borderColor;

                const dropdownY = this._dropdownY;
                g.beginPath();
                g.rect(x, dropdownY, this._bounds.width, this._dropDownHeight);
                g.clip();
                g.fill();
                g.stroke();
                g.translate(0, this._translationY);
                for (let i = 0; i < this._items.length; ++i) {
                    const item = this._items[i];
                    const textMeasure = g.measureText(item.label);
                    g.fillStyle = this._textColor;
                    const labelWidth = textMeasure.width;
                    if (i === this._hoveredIndex) {
                        g.fillStyle = this._itemHoverColor;
                        g.fillRect(
                            x,
                            dropdownY + i * itemHeight,
                            w,
                            itemHeight
                        );
                    }
                    g.fillStyle = this._textColor;
                    g.fillText(
                        item.label,
                        x + w / 2 - labelWidth / 2,
                        dropdownY +
                            labelHeight / 4 +
                            i * itemHeight +
                            labelHeight * 2
                    );
                }
            }
        }
        g.restore();
    }
}
