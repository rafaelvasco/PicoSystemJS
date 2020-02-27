import CanvasElement from "../CanvasElement";
import Rect from "../../model/Rect";
import CanvasDropDown from "../CanvasControls/CanvasDropdown";
import SpriteEditor from "../SpriteEditor";
import { MouseButtons } from "../../model/MouseButtons";
import Props from "../../properties/palette.json";
import Palettes from "../../properties/builtinPalettes.json";

class PaletteEvent {
    constructor() {
        this.button;
        this.color;
    }
}

export default class Palette extends CanvasElement {

    static SelectEvent = 0;
    static ColorButtonIndex1 = MouseButtons.Left;
    static ColorButtonIndex2 = MouseButtons.Right;

    constructor() {

        super("palette", Props.Width, Props.Height);

        this._props = Props;
        
        this._colors = [];
        this._mouseDown = false;
        this._mouseButtonDown = -1;
        this._currentPalette = this._props.CurrentPaletteKey;
        this._predefinedPalettes = Palettes;
        this._predefinedPaletteNames = Object.keys(this._predefinedPalettes);
        this._cells = [];
        this._cellSize = this._props.CellSize;
        this._hoveredCellIndex = -1;
        this._selectedCellsIndices = {};
        this._event = new PaletteEvent();

        const padding = this._props.Padding;
        
        this._dropdown = new CanvasDropDown({
            parent: this,
            style: {
                backColor: "#444",
                borderColor: "#222",
                itemHoverColor: "#222",
                font: this._props.LabelFont,
                textColor: "white"
            },
            bounds: new Rect(padding, this.height - 45, this.width - padding*2, 40),
        });
        this.addControl(this._dropdown);
        this._dropdown.on(CanvasDropDown.ChangeEvent, val => {
            this.setPalette(val);
        });
        this._dropdown.addItem(this._props.CurrentPaletteKey, this._props.CurrentPaletteKey);

        this._predefinedPaletteNames.forEach(paletteName => {
            if (this._predefinedPalettes[paletteName].length > 0) {
                this._dropdown.addItem(paletteName, paletteName);
            }
        });

        this._refresh();
    }

    setPalette(palette) {
        this._selectedCellsIndices[Palette.ColorButtonIndex1] = -1;
        this._selectedCellsIndices[Palette.ColorButtonIndex2] = -1;
        this._currentPalette = palette;
        if (palette === this._props.CurrentPaletteKey) {
            const pixmap = SpriteEditor.Ref.pixmap;
            if (pixmap) {
                this.updateCurrentLabelColorsPalette(SpriteEditor.Ref.pixmap);

            }
            else {
                this._colors = [];
            }
            
            this._refresh();
            return;
        }
        if (this._predefinedPalettes[palette]) {
            this._colors = this._predefinedPalettes[palette];
            this._refresh();
        }
    }

    _selectColor(colorIndex, paletteIndex) {
        this._event.button = colorIndex;
        this._event.color = this._colors[paletteIndex];
        this._selectedCellsIndices[colorIndex] = this._hoveredCellIndex;
        this.emit(Palette.SelectEvent, this._event);
    }

    updateCurrentLabelColorsPalette(pixmap) {
        if (this._currentPalette === this._props.CurrentPaletteKey) {
            this._colors = pixmap.getPallete();
            this._refresh();
        }
    }

    _refresh() {
        this._generateCells();
        this.paint();
    }

    onMouseDown(e) {
        super.onMouseDown(e);
        if (
            e.button === Palette.ColorButtonIndex1 ||
            e.button === Palette.ColorButtonIndex2
        ) {
            this._mouseDown = true;
            this._mouseButtonDown = e.button;
            if (this._hoveredCellIndex !== -1) {
                this._selectColor(e.button, this._hoveredCellIndex);
                this.paint();
                return;
            }
        }
        
    }

    onMouseUp(_) {
        this._mouseDown = false;
        this._mouseButtonDown = -1;
    }

    onMouseMove(e) {
        super.onMouseMove(e);
        const x = e.offsetX;
        const y = e.offsetY;
        if (this._dropdown.isDropdown === false) {
            const cells = this._cells;
            const cellsLength = cells.length;
            this._hoveredCellIndex = -1;
            for (let i = 0; i < cellsLength; ++i) {
                const cellRect = cells[i];
                if (cellRect.containsPoint(x, y)) {
                    this._hoveredCellIndex = i;
                    break;
                }
            }

            if (
                this._mouseDown === true &&
                this._hoveredCellIndex > 0 &&
                (this._mouseButtonDown === Palette.ColorButtonIndex1 ||
                    this._mouseButtonDown === Palette.ColorButtonIndex2)
            ) {

                this._selectColor(
                    this._mouseButtonDown,
                    this._hoveredCellIndex
                );
                this.paint();
                return;
            }
        } else {
            this._hoveredCellIndex = -1;
        }
    }

    _generateCells() {
        this._cells = [];
        if (this._colors.length === 0) {
            return;
        }
        const length = this._colors.length;
        const cellSize = this._cellSize;
        const spacing = this._props.CellSpacing;
        const padding = this._props.Padding;
        const countX = ((this.width - 2 * padding) / cellSize) | 0;

        for (let i = 0; i < length; ++i) {
            const x = i % countX;
            const y = (i / countX) | 0;
            const rx = x * cellSize + x * spacing + padding;
            const ry = y * cellSize + y * spacing + padding + this._props.GridTopSpacing;
            this._cells.push(new Rect(rx, ry, cellSize, cellSize));
        }
    }

    paint() {
        console.log('pelette paint');
        const g = this._gfx;
        console.log(g);
        console.log(this.domElement.width);
        
        g.fillStyle = "#333";
        g.resetTransform();
        g.clearRect(0, 0, this.width, this.height);
        g.fillRect(0, 0, this.width, this.height);
        g.strokeStyle = "#777";
        g.strokeRect(0, 0, this.width, this.height);

        g.fillStyle = 'white';
        g.font = this._props.LabelFont;
        const labelMeasure = g.measureText(this._props.Label);
        g.fillText(this._props.Label, this.width/2 - labelMeasure.width/2, this._props.LabelTopSpacing);

        const cellsLength = this._cells.length;
        for (let i = 0; i < cellsLength; ++i) {
            const cellRect = this._cells[i];
            const x = cellRect.x;
            const y = cellRect.y;
            const w = cellRect.width;
            const h = cellRect.height;
            g.fillStyle = this._colors[i];
            g.fillRect(x, y, w, h);

            if (this._selectedCellsIndices[Palette.ColorButtonIndex1] === i) {
                g.strokeStyle = "blue";
                g.lineWidth = 2;
                g.strokeRect(x + 1, y + 1, w - 2, h - 2);
                g.strokeStyle = "white";
                g.lineWidth = 2;
                g.strokeRect(x + 3, y + 3, w - 6, h - 6);
            }
            if (this._selectedCellsIndices[Palette.ColorButtonIndex2] === i) {
                g.strokeStyle = "red";
                g.lineWidth = 2;
                g.strokeRect(x + 1, y + 1, w - 2, h - 2);
                g.strokeStyle = "white";
                g.lineWidth = 2;
                g.strokeRect(x + 3, y + 3, w - 6, h - 6);
            }
        }

        this._dropdown.paint(g);
    }
}
