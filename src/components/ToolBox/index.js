import Element from "../Element";
import "./style.css";
import ToggleButton from "../ToggleButton";

export default class ToolBox extends Element {

    static SelectEvent = 0;

    constructor() {

        super({id: "tool-box"});
        this._penBtn;
        this._fillBtn;
        this._manipulateBtn;
        this._rectBtn;
        this._toolBtns = {};
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

            this.add(btn);
        }
    }

    setOn(toolName) {
        if(this._toolBtns[toolName]) {
            this._toolBtns[toolName].setOn(true, true);
        }
    }
}
