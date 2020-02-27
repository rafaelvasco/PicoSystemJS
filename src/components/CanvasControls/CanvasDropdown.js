import Rect from "../../model/Rect";
import CanvasControl from "./CanvasControl";

export default class CanvasDropDown extends CanvasControl {
    static ItemHeight = 30;

    static ChangeEvent = 0;

    constructor(params) {
        
        super(params);
        this._items = [];
        this._currentIndex = 0;
        this._dropdown = false;
        this._translationY = 0;
        this._dropDownHeight = 0;
        this._maxTranslationY = 0;
        this._hoveredIndex = -1;
        this._lastHoveredIndex = -1;
        this._dropdownY = 0;
        this._fullBounds = new Rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    }

    get isDropdown() {
        return this._dropdown;
    }

    addItem(label, value, selected) {

        this._items.push({
            label: label,
            value: value
        });
        if (typeof selected !== "undefined") {
            this._currentIndex = this._items.length - 1;
        }
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
        this._fullBounds.y = this._dropdownY;
        this._fullBounds.height = this.bounds.height + this._dropDownHeight;
    }

    onMouseDown(button, x, y) {

        if (this._items.length > 0) {

            if (this._bounds.containsPoint(x, y) && this._hoveredIndex === -1) {

                this._dropdown = !this._dropdown;
                this._translationY = 0;
                return true;
            } else if (this._dropdown === true) {

                this._dropdown = false;
                this._translationY = 0;
                if (this._hoveredIndex >= 0) {
                    this._currentIndex = this._hoveredIndex;
                    this._hoveredIndex = -1;
                    this.emit(
                        CanvasDropDown.ChangeEvent,
                        this._items[this._currentIndex].value
                    );
                }
                return true;
            }
        }
        return false;
    }

    onMouseMove(_, y) {

        const itemHeight = CanvasDropDown.ItemHeight;

        if (y > this._dropdownY && y < this._dropdownY + this._dropDownHeight) {

            this._lastHoveredIndex = this._hoveredIndex;
            this._hoveredIndex =
                ((y - this._dropdownY - this._translationY) / itemHeight) | 0;
            if (this._hoveredIndex !== this._lastHoveredIndex) {
                return true;
            }
        } else {

            if (this._hoveredIndex >= 0) {

                this._hoveredIndex = -1;
                return true;
            }
        } 
        return false;
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
        return true;
    }

    hitPoint(x, y) {
        return this._fullBounds.containsPoint(x, y);
    }

    paint(g) {

        const backColor = this.style.backColor;
        const borderColor = this.style.borderColor;
        const textColor = this.style.textColor;
        const itemHoverColor = this.style.itemHoverColor;
        const font = this.style.font;
        const x = this.bounds.x;
        const y = this.bounds.y;
        const w = this.bounds.width;
        const h = this.bounds.height;
        const itemHeight = CanvasDropDown.ItemHeight;

        g.save();
        g.fillStyle = backColor;
        g.fillRect(x, y, w, h);
        g.strokeStyle = borderColor;
        g.strokeRect(x, y, w, h);

        if (this._items.length > 0) {

            const currentItem = this._items[this._currentIndex];

            g.font = font;
            g.fillStyle = textColor;

            const textMeasure = g.measureText(currentItem.label);
            const labelHeight = textMeasure.actualBoundingBoxAscent;

            g.fillText(
                currentItem.label,
                x + w / 2 - textMeasure.width / 2,
                y + h / 2 + labelHeight / 2
            );

            if (this._dropdown === true) {

                g.fillStyle = backColor;
                g.strokeStyle = borderColor;
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
                    const labelWidth = textMeasure.width;

                    g.fillStyle = textColor;
                    
                    if (i === this._hoveredIndex) {

                        g.fillStyle = itemHoverColor;
                        g.fillRect(
                            x,
                            dropdownY + i * itemHeight,
                            w,
                            itemHeight
                        );
                    }

                    g.fillStyle = textColor;
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
