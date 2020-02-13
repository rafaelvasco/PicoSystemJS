import Element from "../Element";
import "./style.css";
import ToggleButton from "../ToggleButton";

export default class ToolBox extends Element {
    static SelectEvent = 0;

    constructor() {
        super("tool-box");
        this._div;
        this._penBtn;
        this._fillBtn;
        this._manipulateBtn;
        this._rectBtn;
        this._toolBtns = {};
        this._initElements();
    }

    get root() {
        return this._div;
    }

    populate(tools, firstActive) {
        for (let i = 0; i < tools.length; ++i) {
            const toolName = tools[i];
            const toolBtnId = `${toolName.toLowerCase()}-btn`;

            const btn = new ToggleButton(
                toolBtnId,
                toolName,
                toolName === firstActive,
                'toolbox'
            );
            btn.on(ToggleButton.EventOn, () => {
                this.emit(ToolBox.SelectEvent, toolName);
            });

            this._toolBtns[toolName] = btn;

            this._div.append(btn.root);
        }
    }

    setOn(toolName) {
        if(this._toolBtns[toolName]) {
            this._toolBtns[toolName].setOn(true, true);
        }
    }

    _initElements() {
        this._div = document.createElement("div");
        this._div.setAttribute("id", this.id);
    }
}
