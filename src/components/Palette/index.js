import CanvasElement from '../CanvasElement';
import Rect from '../../model/Rect';

class PaletteEvent {
    constructor() {
        this.button;
        this.color;
    }
}

export default class Palette extends CanvasElement {

    static SelectEvent = 'palete-select';

    static Sweetie16 = [
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
    ];

    static Pear36 = [
        '#5e315b',
        '#8c3f5d',
        '#ba6156',
        '#f2a65e',
        '#ffe478',
        '#cfff70',
        '#8fde5d',
        '#3ca370',
        '#3d6e70',
        '#323e4f',
        '#322947',
        '#473b78',
        '#4b5bab',
        '#4da6ff',
        '#66ffe3',
        '#ffffeb',
        '#c2c2d1',
        '#7e7e8f',
        '#606070',
        '#43434f',
        '#272736',
        '#3e2347',
        '#57294b',
        '#964253',
        '#e36956',
        '#ffb570',
        '#ff9166',
        '#eb564b',
        '#b0305c',
        '#73275c',
        '#422445',
        '#5a265e',
        '#80366b',
        '#bd4882',
        '#ff6b97',
        '#ffb5b5'
    ];

    static CellSize = 24;
    static Width = 214;
    static Height = 300;
    static Padding = 7;
    static CellSpacing = 1;

    constructor () {
        super("palette", Palette.Width, Palette.Height);
        this._colors = Palette.Pear36;
        this._cells = [];
        this._cellSize = Palette.CellSize;
        this._hoveredCellIndex = -1;
        this._event = new PaletteEvent();
        this._generateCells();
        this.paint();
    }

    onMouseDown(e) {
        if (this._hoveredCellIndex !== -1) {
            this._event.button = e.button;
            this._event.color = this._colors[this._hoveredCellIndex];
            this.emit(Palette.SelectEvent, this._event);
        }
    }

    onMouseUp(e) {}

    onMouseMove(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        const cells = this._cells;
        const cellsLength = cells.length;
        this._hoveredCellIndex = -1;
        for(let i = 0; i < cellsLength; ++i) {
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
        const countX = ((this.width - 2*padding) / cellSize)|0;

        this._cells = [];
        for(let i = 0; i < length; ++i) {
            const x = (i%countX);
            const y = (i/countX)|0;
            const rx = (x*cellSize + (x*spacing) + padding);
            const ry = (y*cellSize + (y*spacing) + padding);
            this._cells.push(new Rect(rx, ry, cellSize, cellSize));
        }
    }

    paint() {

        const g = this._gfx;
        g.fillStyle = '#333';
        g.fillRect(0, 0, this.width, this.height);
        g.strokeStyle = '#777';
        g.strokeRect(0, 0, this.width, this.height);
        const cellsLength = this._cells.length;
        for(let i = 0; i < cellsLength; ++i) {
            const cellRect = this._cells[i];
            const x = cellRect.x;
            const y = cellRect.y;
            const w = cellRect.width;
            const h = cellRect.height;
            g.fillStyle = this._colors[i];
            g.strokeStyle = 'black';
            g.lineWidth = 1;
            g.strokeRect(x-1, y-1, w+2, h+2);
            g.fillRect(x, y, w, h);
        }
    }
}