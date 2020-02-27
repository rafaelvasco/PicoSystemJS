import { Keys } from "../model/Keys";

class ShortcutBinding {
    constructor(key, ctrl, shift, alt, action, context) {
        this.key = key;
        this.ctrl = ctrl;
        this.shift = shift;
        this.alt = alt;
        this.action = action.bind(context);
    }

    check(ctrlState, shiftState, altState) {
        return (
            this.ctrl === ctrlState &&
            this.shift === shiftState &&
            this.alt === altState
        );
    }

    trigger() {
        this.action();
    }
}

export default class ShortcutManager {
    static Ref;

    constructor() {
        this._ctrlDown = false;
        this._shiftDown = false;
        this._altDown = false;
        this._bindings = {};
        ShortcutManager.Ref = this;
    }

    processKeyEvent(key, down) {
        if (key === Keys.Ctrl) {
            this._ctrlDown = down;
        } else if (key === Keys.Shift) {
            this._shiftDown = down;
        } else if (key === Keys.Alt) {
            this._altDown = down;
        } else if (down === true) {
            const keyUpperCase = key.toUpperCase();
            const bindingsForKey = this._bindings[keyUpperCase];
            if (bindingsForKey) {
                for (let i = 0; i < bindingsForKey.length; ++i) {
                    const bind = bindingsForKey[i];
                    if (
                        bind.check(
                            this._ctrlDown,
                            this._shiftDown,
                            this._altDown
                        )
                    ) {
                        bind.trigger();
                        break;
                    }
                }
            }
        }
    }

    bindShortcut(shortcut, callback, context) {
        const shortcutTokens = this._parseShortcut(shortcut);
        let shift = false;
        let ctrl = false;
        let alt = false;
        let key = "";

        for (let i = 0; i < shortcutTokens.length; ++i) {
            const token = shortcutTokens[i];
            switch (token) {
                case "CTRL":
                case "CONTROL":
                    ctrl = true;
                    break;
                case "SHIFT":
                    shift = true;
                    break;
                case "ALT":
                    alt = true;
                    break;
                default:
                    key = token;
                    break;
            }
        }

        const ShortCutBinding = new ShortcutBinding(
            key,
            ctrl,
            shift,
            alt,
            callback,
            context
        );

        if (!this._bindings[key]) {
            this._bindings[key] = [];
        }
        this._bindings[key].push(ShortCutBinding);
    }

    _parseShortcut(shortcut) {
        return shortcut.split("+").map(token => {
            return token.toUpperCase();
        });
    }
}
