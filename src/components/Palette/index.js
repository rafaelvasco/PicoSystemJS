import CanvasElement from "../CanvasElement";
import Rect from "../../model/Rect";
import './style.css';
import CanvasDropDown from "../CanvasControls/CanvasDropdown";

class PaletteEvent {
    constructor() {
        this.button;
        this.color;
    }
}

export default class Palette extends CanvasElement {
    static SelectEvent = "palete-select";

    static PredefinedPalettes = {
        Sweetie16: [
            "#1a1c2c",
            "#5d275d",
            "#b13e53",
            "#ef7d57",
            "#ffcd75",
            "#a7f070",
            "#38b764",
            "#257179",
            "#29366f",
            "#3b5dc9",
            "#41a6f6",
            "#73eff7",
            "#f4f4f4",
            "#94b0c2",
            "#566c86",
            "#333c5f"
        ],
        Pear36: [
            "#5e315b",
            "#8c3f5d",
            "#ba6156",
            "#f2a65e",
            "#ffe478",
            "#cfff70",
            "#8fde5d",
            "#3ca370",
            "#3d6e70",
            "#323e4f",
            "#322947",
            "#473b78",
            "#4b5bab",
            "#4da6ff",
            "#66ffe3",
            "#ffffeb",
            "#c2c2d1",
            "#7e7e8f",
            "#606070",
            "#43434f",
            "#272736",
            "#3e2347",
            "#57294b",
            "#964253",
            "#e36956",
            "#ffb570",
            "#ff9166",
            "#eb564b",
            "#b0305c",
            "#73275c",
            "#422445",
            "#5a265e",
            "#80366b",
            "#bd4882",
            "#ff6b97",
            "#ffb5b5"
        ]
    };

    static CellSize = 24;
    static Width = 214;
    static Height = 300;
    static Padding = 7;
    static CellSpacing = 1;

    constructor() {
        super("palette", Palette.Width, Palette.Height);
        this._colors = Palette.PredefinedPalettes.Pear36;
        this._predefinedPaletteNames = Object.keys(Palette.PredefinedPalettes);
        this._pixmapColors = [];
        this._cells = [];
        this._cellSize = Palette.CellSize;
        this._hoveredCellIndex = -1;
        this._selectedCellIndexPrimary = -1;
        this._selectedCellIndexSecondary = -1;
        this._event = new PaletteEvent();
        const padding = Palette.Padding;
        this._dropdown = new CanvasDropDown({
            parent: this,
            backColor: '#444',
            borderColor: '#222',
            x: padding,
            y: this.height - 45,
            w: this.width - padding*2,
            h: 40,
            font: 'bold 12px Arial',
            textColor: 'white'
        });
        this._dropdown.addItem('Item1', 'Item1');
        this._dropdown.addItem('Item2', 'Item2');
        this._dropdown.addItem('Item3', 'Item3');
        this._refresh();
    }

    setPalette(palette) {
        if (palette === "Current") {
            this._colors = this._pixmapColors;
            this._refresh();
            return;
        }
        if (Palette.PredefinedPalettes[palette]) {
            this._colors = Palette.PredefinedPalettes[palette];
            this._refresh();
        }
    }

    _refresh() {
        this._generateCells();
        this.paint();
    }

    onMouseDown(e) {
        if (this._hoveredCellIndex !== -1) {
            this._event.button = e.button;
            this._event.color = this._colors[this._hoveredCellIndex];
            if (e.button === 0) {
                this._selectedCellIndexPrimary = this._hoveredCellIndex;
            } else if (e.button === 2) {
                this._selectedCellIndexSecondary = this._hoveredCellIndex;
            }
            this.emit(Palette.SelectEvent, this._event);
            this.paint();
            return;
        }
        if(this._dropdown.bounds.containsPoint(e.offsetX, e.offsetY)) {
            this._dropdown.onMouseDown(e.button, e.offsetX, e.offsetY);
        }
    }

    onMouseUp(e) {}

    onMouseMove(e) {
        const x = e.offsetX;
        const y = e.offsetY;
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
    }

    _generateCells() {
        const length = this._colors.length;
        const cellSize = this._cellSize;
        const spacing = Palette.CellSpacing;
        const padding = Palette.Padding;
        const countX = ((this.width - 2 * padding) / cellSize) | 0;

        this._cells = [];
        for (let i = 0; i < length; ++i) {
            const x = i % countX;
            const y = (i / countX) | 0;
            const rx = x * cellSize + x * spacing + padding;
            const ry = y * cellSize + y * spacing + padding;
            this._cells.push(new Rect(rx, ry, cellSize, cellSize));
        }
    }

    paint() {
        const g = this._gfx;
        g.fillStyle = "#333";
        g.fillRect(0, 0, this.width, this.height);
        g.strokeStyle = "#777";
        g.strokeRect(0, 0, this.width, this.height);
        const cellsLength = this._cells.length;
        for (let i = 0; i < cellsLength; ++i) {
            const cellRect = this._cells[i];
            const x = cellRect.x;
            const y = cellRect.y;
            const w = cellRect.width;
            const h = cellRect.height;
            g.fillStyle = this._colors[i];
            g.strokeStyle = "black";
            g.lineWidth = 1;
            g.strokeRect(x - 1, y - 1, w + 2, h + 2);
            g.fillRect(x, y, w, h);

            if (this._selectedCellIndexPrimary === i) {
                g.strokeStyle = "blue";
                g.lineWidth = 2;
                g.strokeRect(x + 1, y + 1, w - 2, h - 2);
                g.strokeStyle = "white";
                g.lineWidth = 2;
                g.strokeRect(x + 3, y + 3, w - 6, h - 6);
            }
            if (this._selectedCellIndexSecondary === i) {
                g.strokeStyle = "red";
                g.lineWidth = 2;
                g.strokeRect(x + 1, y + 1, w - 2, h - 2);
                g.strokeStyle = "white";
                g.lineWidth = 2;
                g.strokeRect(x + 3, y + 3, w - 6, h - 6);
            }
        }

        /* Draw Palette Selector */
        const lastCell = this._cells[this._cells.length-1];
        this._dropdown.paint(g, {
           
        });

        // g.fillStyle = '#444';
        
        // const x = padding;
        // const y = lastCell.y + lastCell.height + 10 + padding;
        // const width = this.width - padding*2;
        // const height = 40;
        // g.fillRect(x, y, width, height);
        // g.strokeStyle = "#222";
        // g.strokeRect(x, y, width, height);
        // g.font = 'bold 12px Arial';
        // g.fillStyle = "white";
        // const textMeasure = g.measureText('Hello');
        // g.fillText('Hello', x + width/2 - textMeasure.width/2, y + height/2 + textMeasure.actualBoundingBoxAscent/2);
    }
}
