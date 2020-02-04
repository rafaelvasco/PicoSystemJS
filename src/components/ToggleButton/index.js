import Element from "../Element";

export default class ToggleButton extends Element {
    static Groups = {};
    static ClassName = 'toggle-button';
    static EventOn = 'toggle-on';
    static EventOff =  'toggle-off';

    constructor(id, label, on = false, group = undefined) {
        super(id);
        this._label = label;
        this._div;
        this._labelElement;
        this._initElements();
        this._on = false;
        this.setOn(on);
        this._group = group;

        if (group) {
            if (!ToggleButton.Groups[group]) {
                ToggleButton.Groups[group] = [];
            }
            ToggleButton.Groups[group].push(this);
        }
    }

    get root() {
        return this._div;
    }

    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
    }

    get isOn() {
        return this._on;
    }

    _initElements() {
        this._div = document.createElement("div");
        this._div.className = ToggleButton.ClassName;
        this._div.setAttribute("id", this.id);
        this._div.addEventListener("click", () => {
            this._onClick();
        });
        this._labelElement = document.createElement("span");
        this._labelElement.innerText = this._label;
        this._div.append(this._labelElement);
        this._div.style.display = "grid";
        this._div.style.justifyItems = "center";
        this._div.style.alignItems = "center";
        this._div.style.boxSizing = "border-box";
        this._div.style.cursor = "default";
        this._div.style.userSelect = "none";
        this._div.style.padding = "5px";
    }

    setOn(on, emitEvent = false) {
        this._on = on;
        if (on) {
            this._div.classList.add("on");
            if (emitEvent === true) {
                this.emit(ToggleButton.EventOn);
            }

            if (this._group) {
                const groupItems = ToggleButton.Groups[this._group];
                if (groupItems) {
                    for (let i = 0; i < groupItems.length; ++i) {
                        if (groupItems[i].id !== this.id) {
                            groupItems[i].setOn(false, /*emit*/false);
                        }
                    }
                }
            }
        } else {
            this._div.classList.remove("on");
            if (emitEvent === true) {
                this.emit(ToggleButton.EventOff);
            }
        }
    }

    _onClick() {
        if (this._group === undefined) {
            this._on = !this._on;
        } else {
            if (this._on === false) {
                this._on = true;
            }
        }

        this.setOn(this._on, /*emit*/true);
    }
}
