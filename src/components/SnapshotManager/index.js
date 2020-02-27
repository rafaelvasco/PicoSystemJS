import CanvasElement from "../CanvasElement";
import CanvasSelectList from "../CanvasControls/CanvasSelectList";
import Rect from "../../model/Rect";

import Props from "../../properties/snapshotManager.json";

export default class SnapshotManager extends CanvasElement {

    static Events = {
        SnapshotSelected: 0
    };

    constructor () {
        super("snapshot-manager", Props.Width, Props.Height);

        this._props = Props;

        const padding = Props.Padding;

        this._itemSelect = new CanvasSelectList({
            parent: this,
            style: {
                backColor: this._props.SelectList.BackColor,
                borderColor: this._props.SelectList.BorderColor,
                itemSelectColor: this._props.SelectList.ItemSelectColor,
                font: this._props.Font,
                textColor: this._props.TextColor
            },
            bounds: new Rect(padding, padding, this.width - padding * 2, this.height - padding * 2)
           
        });

        this.addControl(this._itemSelect);

        this._itemSelect.on(CanvasSelectList.ChangeEvent, this._onListSelect, this);
        this.paint();
    }

    _onListSelect(index) {
        this.emit(SnapshotManager.Events.SnapshotSelected, index);
    }

    undo() {
        let newSelectedIndex = this._itemSelect.currentIndex-1;

        if(newSelectedIndex < 0) {
            newSelectedIndex = 0;
        }

        this._itemSelect.selectItem(newSelectedIndex);

        this.emit(SnapshotManager.Events.SnapshotSelected, newSelectedIndex);
    }

    redo() {

        let newSelectedIndex = this._itemSelect.currentIndex+1;

        if (newSelectedIndex > this._itemSelect.length-1) {
            newSelectedIndex = this._itemSelect.length-1;
        }

        this._itemSelect.selectItem(newSelectedIndex);

        this.emit(SnapshotManager.Events.SnapshotSelected, newSelectedIndex);
    }

    updateSnapshotList(snapshots, currentSnapshotIndex) {
        this._itemSelect.clear();
        for(let i = 0; i < snapshots.length; ++i) {
            const snapshot = snapshots[i];
            this._itemSelect.addItem(snapshot.label, snapshot.key);
        }
        this._itemSelect.selectItem(currentSnapshotIndex);
        this.paint();
    }

    paint() {
        const g = this._gfx;
        g.fillStyle = this._props.BackColor;
        g.fillRect(0, 0, this.width, this.height);
        g.strokeStyle = this._props.BorderColor;
        g.strokeRect(0, 0, this.width, this.height);

        super.paint();
    }
}