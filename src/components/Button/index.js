import Element from "../Element";

export default class Button extends Element {
    constructor(id, label) {
        super({
            id: id,
            elementTag: "button",
            className: "btn",
            label: label
        });
        this.on("click", () => {
            this.emit("click");
        });
    }

    click() {
        this.domElement.click();
    }

    get label() {
        this.domElement.textContent;
    }
    set label(val) {
        this.domElement.textContent = val;
    }
}
