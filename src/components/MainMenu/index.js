import Element from "../Element";
import Button from "../Button";
import "./style.css";

export default class MainMenu extends Element {

    constructor () {
        super({ id: "main-menu" });
        this._initElements();
    }


    _initElements() {
        
        const button = new Button('menu-btn1', 'Btn1');
        this.add(button);

        const button2 = new Button('menu-btn2', 'Btn2');
        this.add(button2);

        const button3 = new Button('menu-btn3', 'Btn3');
        this.add(button3);

        const button4 = new Button('menu-btn4', 'Btn4');
        this.add(button4);
    }
}