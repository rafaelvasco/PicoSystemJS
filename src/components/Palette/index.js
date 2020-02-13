import CanvasElement from "../CanvasElement";
import Rect from "../../model/Rect";
import CanvasDropDown from "../CanvasControls/CanvasDropdown";
import SpriteEditor from "../SpriteEditor";

class PaletteEvent {
    constructor() {
        this.button;
        this.color;
    }
}

export default class Palette extends CanvasElement {
    static SelectEvent = 0;

    static Current = "Current";

    static ColorButtonIndex1 = 0;
    static ColorButtonIndex2 = 2;

    static PredefinedPalettes = {
        TwoBitGray: ["#000000", "#676767", "#b6b6b6", "#ffffff"],
        Ammo8: [
            "#040c06",
            "#112318",
            "#1e3a29",
            "#305d42",
            "#4d8061",
            "#89a257",
            "#bedc7f",
            "#eeffcc"
        ],
        Blessing: [],
        Bubblegum16: [],
        CastPixel16: [],
        CgaPalette1High: [],
        ColorGraphicsAdapter: [],
        Comfort44s: [],
        Commodore64: [],
        Dawnbringer32: [],
        Dawnbringers8Color: [],
        Endesga16: [],
        Endesga36: [],
        Famicube: [],
        Faraway48: [],
        FlejaMasterPalette: [],
        FuzzyFour: [],
        GrafxKidGameboyPocketGray: [],
        HallowPumpkin: [],
        IceCreamGb: [],
        IslandJoy16: [],
        Journey: [],
        KirbySgb: [],
        KirokazeGb: [],
        Koni32: [],
        LinksAwakeningSgb: [],
        Lux2k: [],
        MegamanVSgb: [],
        MistGb: [],
        Na16: [],
        Nes: [],
        NintendoGbArne: [],
        Nyx8: [],
        OhHellPastel15: [],
        Oil6: [],
        Pico8: [],
        PixelWave: [],
        PokeSgb: [],
        Pollen8: [],
        Rabbit: [],
        Rkbv: [],
        Rosy42: [],
        Slso8: [],
        Supernova7: [],
        Taffy16: [],
        VinesFlexibleLinearRamps: [],
        Vinik24: [],
        WishGb: [],
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
            "#333c57"
        ],
        ArcadeStandard29: [],
        Endesga32: [
            "#be4a2f",
            "#d77643",
            "#ead4aa",
            "#e4a672",
            "#b86f50",
            "#733e39",
            "#3e2731",
            "#a22633",
            "#e43b44",
            "#f77622",
            "#feae34",
            "#fee761",
            "#63c74d",
            "#3e8948",
            "#265c42",
            "#193c3e",
            "#124e89",
            "#0099db",
            "#2ce8f5",
            "#ffffff",
            "#c0cbdc",
            "#8b9bb4",
            "#5a6988",
            "#3a4466",
            "#262b44",
            "#181425",
            "#ff0044",
            "#68386c",
            "#b55088",
            "#f6757a",
            "#e8b796",
            "#c28569"
        ],
        Zughy32: [
            "#472d3c",
            "#5e3643",
            "#7a444a",
            "#a05b53",
            "#bf7958",
            "#eea160",
            "#f4cca1",
            "#b6d53c",
            "#71aa34",
            "#397b44",
            "#3c5956",
            "#302c2e",
            "#5a5353",
            "#7d7071",
            "#a0938e",
            "#cfc6b8",
            "#dff6f5",
            "#8aebf1",
            "#28ccdf",
            "#3978a8",
            "#394778",
            "#39314b",
            "#564064",
            "#8e478c",
            "#cd6093",
            "#ffaeb6",
            "#f4b41b",
            "#f47e1b",
            "#e6482e",
            "#a93b3b",
            "#827094",
            "#4f546b"
        ],
        BLK36: [],
        BLKNeo: [],
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
        ],
        AAP64: [],
        Endesga64: [
            "#ff0040",
            "#131313",
            "#1b1b1b",
            "#272727",
            "#3d3d3d",
            "#5d5d5d",
            "#858585",
            "#b4b4b4",
            "#ffffff",
            "#c7cfdd",
            "#92a1b9",
            "#657392",
            "#424c6e",
            "#2a2f4e",
            "#1a1932",
            "#0e071b",
            "#1c121c",
            "#391f21",
            "#5d2c28",
            "#8a4836",
            "#bf6f4a",
            "#e69c69",
            "#f6ca9f",
            "#f9e6cf",
            "#edab50",
            "#e07438",
            "#c64524",
            "#8e251d",
            "#ff5000",
            "#ed7614",
            "#ffa214",
            "#ffc825",
            "#ffeb57",
            "#d3fc7e",
            "#99e65f",
            "#5ac54f",
            "#33984b",
            "#1e6f50",
            "#134c4c",
            "#0c2e44",
            "#00396d",
            "#0069aa",
            "#0098dc",
            "#00cdf9",
            "#0cf1ff",
            "#94fdff",
            "#fdd2ed",
            "#f389f5",
            "#db3ffd",
            "#7a09fa",
            "#3003d9",
            "#0c0293",
            "#03193f",
            "#3b1443",
            "#622461",
            "#93388f",
            "#ca52c9",
            "#c85086",
            "#f68187",
            "#f5555d",
            "#ea323c",
            "#c42430",
            "#891e2b",
            "#571c27"
        ]
    };

    static CellSize = 24;
    static Width = 214;
    static Height = 300;
    static Padding = 7;
    static CellSpacing = 1;

    constructor() {
        super("palette", Palette.Width, Palette.Height);
        this._colors = [];
        this._mouseDown = false;
        this._mouseButtonDown = -1;
        this._currentPalette = Palette.Current;
        this._predefinedPaletteNames = Object.keys(Palette.PredefinedPalettes);
        this._cells = [];
        this._cellSize = Palette.CellSize;
        this._hoveredCellIndex = -1;
        this._selectedCellsIndices = {};
        this._event = new PaletteEvent();
        const padding = Palette.Padding;
        this._dropdown = new CanvasDropDown({
            parent: this,
            style: {
                backColor: "#444",
                borderColor: "#222",
                itemHoverColor: "#222",
                font: "bold 12px Arial",
                textColor: "white"
            },
            bounds: new Rect(padding, this.height - 45, this.width - padding*2, 40),
        });
        this._dropdown.on(CanvasDropDown.ChangeEvent, val => {
            this.setPalette(val);
        });
        this._dropdown.addItem(Palette.Current, Palette.Current);

        this._predefinedPaletteNames.forEach(paletteName => {
            if (Palette.PredefinedPalettes[paletteName].length > 0) {
                this._dropdown.addItem(paletteName, paletteName);
            }
        });

        this._refresh();
    }

    setPalette(palette) {
        this._selectedCellsIndices[Palette.ColorButtonIndex1] = -1;
        this._selectedCellsIndices[Palette.ColorButtonIndex2] = -1;
        this._currentPalette = palette;
        if (palette === Palette.Current) {
            this.updateCurrentColorsPalette(SpriteEditor.Ref.pixmap);
            return;
        }
        if (Palette.PredefinedPalettes[palette]) {
            this._colors = Palette.PredefinedPalettes[palette];
            this._refresh();
        }
    }

    _selectColor(colorIndex, paletteIndex) {
        this._event.button = colorIndex;
        this._event.color = this._colors[paletteIndex];
        this._selectedCellsIndices[colorIndex] = this._hoveredCellIndex;
        this.emit(Palette.SelectEvent, this._event);
    }

    updateCurrentColorsPalette(pixmap) {
        if (this._currentPalette === Palette.Current) {
            this._colors = pixmap.getPallete();
            this._refresh();
        }
    }

    _refresh() {
        this._generateCells();
        this.paint();
    }

    onMouseDown(e) {
        e.preventDefault();
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
            if (this._dropdown.onMouseDown(e.button, e.offsetX, e.offsetY)) {
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
        if (this._dropdown.onMouseMove(x, y)) {
            this.paint();
            return;
        }
    }

    onMouseWheel(e) {
        if (this._dropdown.onMouseWheel(e.deltaY)) {
            this.paint();
            return;
        }
    }

    _generateCells() {
        this._cells = [];
        if (this._colors.length === 0) {
            return;
        }
        const length = this._colors.length;
        const cellSize = this._cellSize;
        const spacing = Palette.CellSpacing;
        const padding = Palette.Padding;
        const countX = ((this.width - 2 * padding) / cellSize) | 0;

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
        g.resetTransform();
        g.clearRect(0, 0, this.width, this.height);
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

        /* Draw Palette Selector */
        this._dropdown.paint(g);
    }
}
