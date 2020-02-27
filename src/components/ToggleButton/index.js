import Element from "../Element";

export default class ToggleButton extends Element {

    static Groups = {};
    static EventOn = 0;
    static EventOff =  1;

    constructor(id, label, on = false, group = undefined) {
        super({
            id: id,
            className: 'btn',
            elementTag: 'button',
            label: label
        });
        this.addClass('toggle-btn');
        this._on = false;
        this._group = group;
        this._initElements();
        this.setOn(on);

        if (group) {
            if (!ToggleButton.Groups[group]) {
                ToggleButton.Groups[group] = [];
            }
            ToggleButton.Groups[group].push(this);
        }
    }

    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
        this._domElement.textContent = val;
    }

    get isOn() {
        return this._on;
    }

    _initElements() {

        this.on("click", () => {
            this._onClick();
        });
    }

    setOn(on, emitEvent = false) {
        this._on = on;
        if (on) {
            this.addClass('on');
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
            this.removeClass('on');
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
