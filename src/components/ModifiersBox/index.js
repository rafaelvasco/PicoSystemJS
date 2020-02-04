import Element from "../Element";
import "./style.css";
import Button from "../Button";
import ToggleButton from "../ToggleButton";

export default class ModifiersBox extends Element {
    static ClearId = 'clear';
    static ClearPixelLinesId = 'clear-lines';
    static HMirrorId = 'h-mirror-toggle';
    static VMirrorId = 'v-mirror-toggle';
    static ButtonsSection = 'Buttons';
    static ToggablesSection = 'Toggables';
    static ActionEvent = "mod-box-action";
    static ClearAction = "clear";
    static EnableHMirrorAction = "h-mirror-enable";
    static EnableVMirrorAction = "v-mirror-enable";
    static DisableHMirrorAction = "h-mirror-disable";
    static DisableVMirrorAction = "v-mirror-disable";

    static Modifiers = {
        Buttons: {
            'clear': {
                Label: "CLEAR",
                Action: ModifiersBox.ClearAction
            }
        },
        Toggables: {
            'h-mirror-toggle': {
                Label: "MIRROR X",
                OnAction: ModifiersBox.EnableHMirrorAction,
                OffAction: ModifiersBox.DisableHMirrorAction
            },
            'v-mirror-toggle': {
                Label: "MIRROR Y",
                OnAction: ModifiersBox.EnableVMirrorAction,
                OffAction: ModifiersBox.DisableVMirrorAction
            }
        }
    };

    constructor() {
        super("mod-box");
        this._div;
        this._toggables = {};
        this._buttons = {};
        this._initElements();
        this._populateActions();
    }

    get root() {
        return this._div;
    }

    triggerModifer(id) {
        
        const toggable = this._toggables[id];
        if (toggable) {
            if(toggable.isOn === false) {
                toggable.setOn(true, /*emit*/true);
            }
            else {
                toggable.setOn(false, /*emit*/true);
            }
        }
        else if (this._buttons[id]) {
            this._buttons[id].click();
        }
    }

    _populateActions() {
        Object.entries(ModifiersBox.Modifiers).forEach(([section, _]) => {
            Object.entries(ModifiersBox.Modifiers[section]).forEach(
                ([elementId, elementData]) => {
                    switch (section) {
                        case ModifiersBox.ButtonsSection:
                            const button = new Button(
                                elementId,
                                elementData.Label
                            );
                            button.on("click", () => {
                                this.emit(
                                    ModifiersBox.ActionEvent,
                                    elementData.Action
                                );
                            });

                            this._buttons[elementId] = button;
                            this._div.append(button.root);

                            break;
                        case ModifiersBox.ToggablesSection:
                            const toggable = new ToggleButton(
                                elementId,
                                elementData.Label
                            );
                            toggable.on(ToggleButton.EventOn, () => {
                                this.emit(
                                    ModifiersBox.ActionEvent,
                                    elementData.OnAction
                                );
                            });
                            toggable.on(ToggleButton.EventOff, () => {
                                this.emit(
                                    ModifiersBox.ActionEvent,
                                    elementData.OffAction
                                );
                            });

                            this._toggables[elementId] = toggable;
                            this._div.append(toggable.root);

                            break;
                    }
                }
            );
        });
    }

    _initElements() {
        this._div = document.createElement("div");
        this._div.setAttribute("id", this.id);
    }
}
