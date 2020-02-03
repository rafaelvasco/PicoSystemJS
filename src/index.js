import App from "components/App";
import "main.css";

const main = async () => {
    const app = new App();
    app.init();
};

main().then(() =>
    console.log(
        "%c\u0020%c\u0020%c\u0020%c\u0020%c\u0020%c :: PicoSystem :: %c%c\u0020%c\u0020%c\u0020%c\u0020%c\u0020",
        "background-color: #74569b;padding: 2px",
        "background-color: #96fbc7;padding: 2px",
        "background-color: #f7ffae;padding: 2px",
        "background-color: #ffb3cb;padding: 2px",
        "background-color: #d8bfd8;padding: 2px",
        "bacground-color: rgba(0,0,0,0);padding: 2px",
        "bacground-color: rgba(0,0,0,0);padding: 2px",
        "background-color: #d8bfd8;padding: 2px",
        "background-color: #ffb3cb;padding: 2px",
        "background-color: #f7ffae;padding: 2px",
        "background-color: #96fbc7;padding: 2px",
        "background-color: #74569b;padding: 2px",
    )
);
