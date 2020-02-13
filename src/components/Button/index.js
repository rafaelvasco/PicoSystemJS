import Element from "../Element";

export default class Button extends Element {
    constructor(id, label) {
        super(id);
        this._button;
        this._initComponents(label);
       
    }

    _initComponents(label) {
        this._button = document.createElement("button");
        this._button.style.padding = '5px';
        this._button.className = "button";
        this._button.style.outline = 0;
        this._button.addEventListener("click", () => {
            this.emit("click");
        });
        this._button.setAttribute("id", this.id);

        if (label) {
            this._button.textContent = label;
        }
    }

    click() {
        this._button.click();
    }

    get root() {
        return this._button;
    }

    get label() {
        this._button.textContent;
    }
    set label(val) {
        this._button.textContent = val;
    }
}
