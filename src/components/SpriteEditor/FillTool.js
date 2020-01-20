import Tool from "./Tool";
import { ToolNames } from "../../model/Constants";

export default class FillTool extends Tool {
    constructor() {
        super();
        this._contiguous = true;
    }

    get contiguous() {
        return this._contiguous;
    }

    set contiguous(val) {
        this._contiguous = val;
    }

    get name() {
        return ToolNames.Fill;
    }

    onMouseDown(editor, event) {
        const button = event.button;
        const pos = event.pos;
        const pixmap = editor.pixmap;

        const color =
            button === 0
                ? editor.primaryColor
                : button === 2
                ? editor.secondaryColor
                : editor.primaryColor;

        if (this._contiguous === true) {
            pixmap.fill(pos.x, pos.y, color);
        } else {
            pixmap.fillAll(pos.x, pos.y, color);
        }

        return true;
    }
}
