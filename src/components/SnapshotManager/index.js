import CanvasElement from "../CanvasElement";
import CanvasSelectList from "../CanvasControls/CanvasSelectList";
import Rect from "../../model/Rect";

export default class SnapshotManager extends CanvasElement {

    static Width = 214;
    static Height = 300;
    static Padding = 1;

    static Events = {
        SnapshotSelected: 0
    };

    constructor () {
        super("snapshot-manager", SnapshotManager.Width, SnapshotManager.Height);
        const padding = SnapshotManager.Padding;
        this._itemSelect = new CanvasSelectList({
            parent: this,
            style: {
                backColor: "#222",
                borderColor: "#222",
                itemSelectColor: "#333",
                font: "bold 12px Arial",
                textColor: "white"
            },
            bounds: new Rect(padding, padding, this.width - padding * 2, this.height - padding * 2)
           
        });
        this._itemSelect.on(CanvasSelectList.ChangeEvent, this._onListSelect, this);
        this.paint();
    }

    _onListSelect(item) {
        this.emit(SnapshotManager.Events.SnapshotSelected, item.value);
    }

    addSnapshot(snapshot) {
        this._itemSelect.addItem(snapshot.label, snapshot.key);
        this.paint();
    }

    onMouseDown(e) {
        e.preventDefault();
        if (this._itemSelect.onMouseDown(e.button, e.offsetX, e.offsetY)) {
            this.paint();
            return;
        }
    }

    onMouseUp(e) {
        if (this._itemSelect.onMouseUp(e)) {
            this.paint();
            return;
        }
    }

    onMouseMove(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        if (this._itemSelect.onMouseMove(x, y)) {
            this.paint();
            return;
        }
    }

    paint() {
        const g = this._gfx;
        g.fillStyle = "#333";
        g.fillRect(0, 0, this.width, this.height);
        g.strokeStyle = "#777";
        g.strokeRect(0, 0, this.width, this.height);
        this._itemSelect.paint(g);
    }
}