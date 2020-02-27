import Element from "../Element";
import './style.css';

export default class CenterPanel extends Element {
    constructor() {
        super({id: 'center-panel'});
        this._sections = [];
        this._sectionIndex = 0;
    }

    addSection(element) {
        this._sections.push(element.id);
        this.add(element);
    }
}